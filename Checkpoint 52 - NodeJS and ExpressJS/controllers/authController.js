const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userStore = require("../models/userStore");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

function signAndSendToken(user, statusCode, res) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email, and password.", 400));
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters long.", 400));
  }

  if (userStore.findByEmail(email)) {
    return next(new AppError("An account with that email already exists.", 409));
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const newUser = userStore.create({ name, email, passwordHash });

  signAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide both email and password.", 400));
  }

  const user = userStore.findByEmail(email);
  if (!user || !user.passwordHash) {
    return next(new AppError("Invalid email or password.", 401));
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return next(new AppError("Invalid email or password.", 401));
  }

  signAndSendToken(user, 200, res);
});

exports.googleCallback = (req, res) => {
  signAndSendToken(req.user, 200, res);
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(200).json({ status: "success", message: "Logged out successfully." });
};
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const userStore = require("../models/userStore");

const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return next(new AppError("Authentication required. Please log in.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = userStore.findById(decoded.id);

    if (!currentUser) {
      return next(new AppError("The user belonging to this token no longer exists.", 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token. Please log in again.", 401));
  }
};

module.exports = verifyToken;
const express = require("express");
const passport = require("../config/passport");
const authController = require("../controllers/authController");
const { authRateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/signup", authRateLimiter, authController.signup);
router.post("/login", authRateLimiter, authController.login);
router.post("/logout", authController.logout);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/login" }),
  authController.googleCallback
);

module.exports = router;
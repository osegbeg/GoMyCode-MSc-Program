const rateLimit = require("express-rate-limit");

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/signup attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
});

module.exports = { authRateLimiter };
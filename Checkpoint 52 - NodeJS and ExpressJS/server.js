require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const { clean } = require("xss-clean/lib/xss");
const passport = require("./config/passport");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Security HTTP headers
app.use(helmet());

// 2. Body & cookie parsers
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// 3. Data sanitization against NoSQL query injection & XSS
// Note: Express 5 makes req.query a getter, so sanitize body & params safely
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

app.use((req, res, next) => {
  if (req.body) req.body = clean(req.body);
  if (req.params) req.params = clean(req.params);
  next();
});

// 4. Initialize Passport
app.use(passport.initialize());

// 5. Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// 6. Unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// 7. Centralized error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Secure Task Manager API running on http://localhost:${PORT}`);
});
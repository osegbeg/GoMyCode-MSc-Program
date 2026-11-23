const express = require("express");
const path = require("path");
const workingHoursMiddleware = require("./middleware/workingHours");

const app = express();
const PORT = 3000;

// Configure EJS template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static CSS files before the working-hours gate so the closed page stays styled
app.use(express.static(path.join(__dirname, "public")));

// Apply custom working-hours middleware to all routes
app.use(workingHoursMiddleware);

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Home", activePage: "home" });
});

app.get("/services", (req, res) => {
  res.render("services", { title: "Our Services", activePage: "services" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us", activePage: "contact" });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
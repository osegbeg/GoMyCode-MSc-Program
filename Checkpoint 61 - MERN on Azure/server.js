// Load environment variables from config/.env when present (Azure injects env vars directly)
require("dotenv").config({ path: "./config/.env" });

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 8080;

// Parse incoming JSON request bodies
app.use(express.json());

// Connect to MongoDB (MongoDB Atlas in production/Azure, local MongoDB in dev)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully."))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// GET : RETURN ALL USERS
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// POST : ADD A NEW USER TO THE DATABASE
app.post("/users", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

// PUT : EDIT A USER BY ID
app.put("/users/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: "fail", message: "Invalid user ID." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: "fail", message: "User not found." });
    }

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

// DELETE : REMOVE A USER BY ID
app.delete("/users/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: "fail", message: "Invalid user ID." });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ status: "fail", message: "User not found." });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully.",
      data: deletedUser,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Serve static React production files from ./public
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Fallback to index.html for client-side routes (Express 5 syntax)
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// Start Express server
app.listen(PORT, () => {
  console.log(`MERN server running on http://localhost:${PORT}`);
});

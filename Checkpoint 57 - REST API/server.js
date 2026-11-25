// Load environment variables from config/.env
require("dotenv").config({ path: "./config/.env" });

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Connect to MongoDB (local or Atlas via MONGO_URI)
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
    const users = await User.find();
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

// Launch the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

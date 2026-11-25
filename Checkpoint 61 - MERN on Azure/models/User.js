// Import Mongoose to define the schema and compile the model
const mongoose = require("mongoose");

// Define the User schema with basic validation and timestamps
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Export the User model so it can be imported and used in server.js
module.exports = mongoose.model("User", userSchema);

// Import Mongoose to define schema and compile the model
const mongoose = require("mongoose");

// Define the Person prototype schema with basic types, validation, and defaults
const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"], // Required string field
      trim: true,
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"], // Simple numeric validator
      default: 18, // Default value if omitted
    },
    favoriteFoods: {
      type: [String], // Array of strings
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Export the compiled Person model
module.exports = mongoose.model("Person", personSchema);

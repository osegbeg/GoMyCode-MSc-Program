const mongoose = require("mongoose");
const Product = require("../models/Product");

// POST /products -> Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;
    const product = await Product.create({ name, price, category, inStock });
    res.status(201).json({ status: "success", data: product });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// GET /products -> Read all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: "success", results: products.length, data: products });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// GET /products/:id -> Read one product
exports.getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: "fail", message: "Invalid MongoDB ObjectId." });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found." });
    }

    res.status(200).json({ status: "success", data: product });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// PUT /products/:id -> Update product
exports.updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: "fail", message: "Invalid MongoDB ObjectId." });
    }

    const { name, price, category, inStock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, inStock },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ status: "fail", message: "Product not found." });
    }

    res.status(200).json({ status: "success", data: updatedProduct });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// DELETE /products/:id -> Delete product
exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: "fail", message: "Invalid MongoDB ObjectId." });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ status: "fail", message: "Product not found." });
    }

    res.status(200).json({ status: "success", message: "Product deleted from MongoDB." });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
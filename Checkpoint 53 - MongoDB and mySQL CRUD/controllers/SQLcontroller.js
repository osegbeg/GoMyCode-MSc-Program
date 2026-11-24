const { mysqlPool } = require("../config/db");

// POST /products -> Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category = null, inStock = true } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ status: "fail", message: "Name and price are required." });
    }

    const [result] = await mysqlPool.execute(
      "INSERT INTO products (name, price, category, inStock) VALUES (?, ?, ?, ?)",
      [name, price, category, Boolean(inStock)]
    );

    const [rows] = await mysqlPool.execute("SELECT * FROM products WHERE id = ?", [result.insertId]);
    res.status(201).json({ status: "success", data: rows[0] });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// GET /products -> Read all products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await mysqlPool.execute("SELECT * FROM products");
    res.status(200).json({ status: "success", results: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// GET /products/:id -> Read one product
exports.getProductById = async (req, res) => {
  try {
    const [rows] = await mysqlPool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: "fail", message: "Product not found." });
    }

    res.status(200).json({ status: "success", data: rows[0] });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// PUT /products/:id -> Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category = null, inStock = true } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ status: "fail", message: "Name and price are required." });
    }

    const [result] = await mysqlPool.execute(
      "UPDATE products SET name = ?, price = ?, category = ?, inStock = ? WHERE id = ?",
      [name, price, category, Boolean(inStock), req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "fail", message: "Product not found." });
    }

    const [rows] = await mysqlPool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);
    res.status(200).json({ status: "success", data: rows[0] });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// DELETE /products/:id -> Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const [result] = await mysqlPool.execute("DELETE FROM products WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "fail", message: "Product not found." });
    }

    res.status(200).json({ status: "success", message: "Product deleted from MySQL." });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
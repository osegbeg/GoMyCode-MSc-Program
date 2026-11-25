const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 149.99,
    description: "Over-ear wireless headphones with active noise cancellation and 30-hour battery.",
  },
  {
    id: 2,
    name: "Minimalist Mechanical Keyboard",
    category: "Electronics",
    price: 89.0,
    description: "Compact tactile keyboard with hot-swappable switches and USB-C.",
  },
  {
    id: 3,
    name: "Everyday Commuter Backpack",
    category: "Accessories",
    price: 64.5,
    description: "Water-resistant 24L backpack with padded 16-inch laptop sleeve.",
  },
  {
    id: 4,
    name: "Insulated Stainless Steel Flask",
    category: "Home",
    price: 28.0,
    description: "Keeps drinks cold for 24 hours or hot for 12 hours.",
  },
  {
    id: 5,
    name: "Ergonomic Mesh Desk Chair",
    category: "Home",
    price: 239.0,
    description: "Breathable mesh backrest with adjustable lumbar support and armrests.",
  },
  {
    id: 6,
    name: "Polarized Everyday Sunglasses",
    category: "Accessories",
    price: 45.0,
    description: "UV400 polarized lenses with lightweight acetate frames.",
  },
];

const orders = [];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/products", (req, res) => {
  const { category = "All", search = "" } = req.query;
  const q = search.trim().toLowerCase();

  const filtered = products.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  res.json(filtered);
});

app.post("/api/orders", (req, res) => {
  const { customerName, email, items } = req.body;

  if (!customerName || !email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Customer name, email, and at least one cart item are required." });
  }

  const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);
  const order = {
    id: `ORD-${Date.now()}`,
    customerName,
    email,
    items,
    total: Number(total.toFixed(2)),
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  res.status(201).json({ message: "Order placed successfully.", order });
});

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.listen(PORT, () => {
  console.log(`E-Commerce server running on port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const { connectMongoDB, connectMySQL } = require("./config/db");
const { noSqlRouter, sqlRouter } = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount NoSQL (MongoDB) and SQL (MySQL) CRUD routes
app.use("/api/nosql/products", noSqlRouter);
app.use("/api/sql/products", sqlRouter);

async function startServer() {
  try {
    await connectMongoDB();
    await connectMySQL();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(` - MongoDB CRUD: http://localhost:${PORT}/api/nosql/products`);
      console.log(` - MySQL CRUD  : http://localhost:${PORT}/api/sql/products`);
    });
  } catch (err) {
    console.error("Failed to initialize database connections:", err.message);
    process.exit(1);
  }
}

startServer();
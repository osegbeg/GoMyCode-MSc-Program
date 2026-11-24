const mongoose = require("mongoose");
const mysql = require("mysql2/promise");

// 1. MongoDB Connection
async function connectMongoDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB successfully.");
}

// 2. MySQL Connection Pool
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "gomycode_products",
  waitForConnections: true,
  connectionLimit: 10,
});

async function connectMySQL() {
  const connection = await mysqlPool.getConnection();
  connection.release();
  console.log("Connected to MySQL successfully.");
}

module.exports = {
  connectMongoDB,
  connectMySQL,
  mysqlPool,
};
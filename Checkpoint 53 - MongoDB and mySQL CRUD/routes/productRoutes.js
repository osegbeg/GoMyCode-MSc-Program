const express = require("express");
const noSqlController = require("../controllers/NoSQLcontroller");
const sqlController = require("../controllers/SQLcontroller");

const noSqlRouter = express.Router();
noSqlRouter
  .route("/")
  .post(noSqlController.createProduct)
  .get(noSqlController.getAllProducts);

noSqlRouter
  .route("/:id")
  .get(noSqlController.getProductById)
  .put(noSqlController.updateProduct)
  .delete(noSqlController.deleteProduct);

const sqlRouter = express.Router();
sqlRouter
  .route("/")
  .post(sqlController.createProduct)
  .get(sqlController.getAllProducts);

sqlRouter
  .route("/:id")
  .get(sqlController.getProductById)
  .put(sqlController.updateProduct)
  .delete(sqlController.deleteProduct);

module.exports = { noSqlRouter, sqlRouter };
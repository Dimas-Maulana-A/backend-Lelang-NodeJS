const Product = require("./product.controller");
const express = require("express");
const app = express();

app.use("/", Product);

module.exports = app;

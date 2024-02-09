const mongoose = require("mongoose");

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  category: String,
  status: Boolean,
});

const productsModel = mongoose.model(productsCollection, productsSchema);

module.exports = productsModel;

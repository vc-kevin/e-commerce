const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  category: String,
  description: String,
  quantity: Number
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Use _id as a string to match your data
  img: { type: String, required: true }, // URL or path to image
  type: { type: String, required: true }, // e.g., "tshirt", "trouser"
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);
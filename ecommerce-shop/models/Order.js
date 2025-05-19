const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { // Embed full product details
      _id: { type: String, ref: 'Product' },
      img: String,
      type: String,
      title: String,   
      price: Number,
      description: String,
    },
    size: Object, // Measurements
    color: String,
    quantity: Number,
  }],
  totalPrice: { type: Number, required: true },
  userDetails: {
    name: String,
    email: String,
  },
  status: { type: String, default: 'processing', enum: ['processing', 'shipped', 'delivered'] },
  message: { type: String },
});

module.exports = mongoose.model('Order', orderSchema);
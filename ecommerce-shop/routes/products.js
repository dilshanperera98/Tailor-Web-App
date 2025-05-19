const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post('/', auth, async (req, res) => {
  const { _id, img, type, title, price, description } = req.body;
  const product = new Product({ _id, img, type, title, price, description });
  await product.save();
  res.status(201).json({ message: 'Product added successfully' });
});

router.put('/:id', auth, async (req, res) => {
  const { img, type, title, price, description } = req.body;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { img, type, title, price, description },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    res.status(400).json({ message: 'Error updating product', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting product', error: err.message });
  }
});

module.exports = router;
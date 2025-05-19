const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const Product = require('../models/Product'); // Ensure this is imported

router.post('/add', auth, async (req, res) => {
  const { productId } = req.body;
  const order = new Order({ userId: req.user.id, productId });
  await order.save();
  res.status(201).json({ message: 'Order added' });
});

router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

router.post('/checkout', auth, async (req, res) => {
  const { items, totalPrice, userDetails } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Items are required' });
  }
  if (!totalPrice || typeof totalPrice !== 'number') {
    return res.status(400).json({ message: 'Total price is required and must be a number' });
  }
  if (!userDetails || !userDetails.name || !userDetails.email) {
    return res.status(400).json({ message: 'User details (name and email) are required' });
  }

  try {
    // Fetch full product details for each item with error handling
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findOne({ _id: item.productId });
        if (!product) {
          console.warn(`Product with _id ${item.productId} not found, using minimal data`);
          return {
            product: { _id: item.productId, title: 'Unknown Product' }, // Fallback
            size: item.size || {},
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          };
        }
        return {
          product: {
            _id: product._id,
            img: product.img,
            type: product.type,
            title: product.title,
            price: product.price,
            description: product.description,
          },
          size: item.size || {},
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        };
      })
    );

    const order = new Order({
      userId: req.user.id,
      items: updatedItems,
      totalPrice,
      userDetails,
      status: 'processing',
    });

    await order.save();
    res.status(201).json({ message: 'Order saved successfully', order });
  } catch (err) {
    res.status(400).json({ message: 'Error saving order', error: err.message });
  }
});

// Add route to update order status
router.put('/:orderId', auth, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      { status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    res.status(400).json({ message: 'Error updating order status', error: err.message });
  }
});

module.exports = router;
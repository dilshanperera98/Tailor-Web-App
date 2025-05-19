const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.get('/orders', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  const orders = await Order.find();
  res.json(orders);
});

router.put('/orders/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  const { status, message } = req.body;
  await Order.findByIdAndUpdate(req.params.id, { status, message });
  res.json({ message: 'Order updated' });
});

module.exports = router;
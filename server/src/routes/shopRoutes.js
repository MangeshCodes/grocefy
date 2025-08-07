const express = require('express');
const Shop = require('../models/shop');
const User = require('../models/models');
const router = express.Router();

// Add a shop to a user's list by code
router.post('/add-shop', async (req, res) => {
  const { userId, shopCode } = req.body;
  try {
    const shop = await Shop.findOne({ code: shopCode });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.shops) user.shops = [];
    if (!user.shops.includes(shop._id)) user.shops.push(shop._id);
    await user.save();
    res.json({ message: 'Shop added', shop });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get shops near a location
router.get('/nearby', async (req, res) => {
  const { lng, lat, maxDistance = 5000 } = req.query;
  try {
    const shops = await Shop.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all shops for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('shops');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.shops || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

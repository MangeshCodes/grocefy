const Item = require('../models/item');

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const { shopName, itemName, imageUrl, expiryDate, price } = req.body;
    const item = new Item({ shopName, itemName, imageUrl, expiryDate, price });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

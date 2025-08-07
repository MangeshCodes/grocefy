const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Create item
router.post('/', itemController.createItem);
// Get all items
router.get('/', itemController.getItems);

module.exports = router;

const express = require('express');
const router = express.Router();
const { Inventory, CustomerRequest, User } = require('../models/models');

// Get shopkeeper's inventory
router.get('/inventory/:shopkeeperId', async (req, res) => {
  try {
    const { shopkeeperId } = req.params;
    
    const inventory = await Inventory.find({ shopkeeper: shopkeeperId })
      .sort({ createdAt: -1 });
    
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Add new inventory item
router.post('/inventory', async (req, res) => {
  try {
    const {
      shopkeeperId,
      itemName,
      category,
      price,
      stock,
      expiryDate,
      imageUrl,
      description
    } = req.body;

    // Validate shopkeeper exists
    const shopkeeper = await User.findById(shopkeeperId);
    if (!shopkeeper || shopkeeper.role !== 'shopkeeper') {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    const newItem = new Inventory({
      shopkeeper: shopkeeperId,
      itemName,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      expiryDate: new Date(expiryDate),
      imageUrl,
      description
    });

    await newItem.save();
    
    res.status(201).json({
      message: 'Inventory item added successfully',
      item: newItem
    });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ error: 'Failed to add inventory item' });
  }
});

// Update inventory item
router.put('/inventory/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    // Convert price and stock to proper types if they exist
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.stock) updates.stock = parseInt(updates.stock);
    if (updates.expiryDate) updates.expiryDate = new Date(updates.expiryDate);

    const updatedItem = await Inventory.findByIdAndUpdate(
      itemId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json({
      message: 'Inventory item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

// Delete inventory item
router.delete('/inventory/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    const deletedItem = await Inventory.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

// Get customer requests for shopkeeper
router.get('/requests/:shopkeeperId', async (req, res) => {
  try {
    const { shopkeeperId } = req.params;
    
    const requests = await CustomerRequest.find({ shopkeeper: shopkeeperId })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching customer requests:', error);
    res.status(500).json({ error: 'Failed to fetch customer requests' });
  }
});

// Update customer request status
router.put('/requests/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, responseMessage } = req.body;

    const updatedRequest = await CustomerRequest.findByIdAndUpdate(
      requestId,
      { status, responseMessage },
      { new: true }
    ).populate('customer', 'name email');

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Customer request not found' });
    }

    res.json({
      message: 'Customer request updated successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error updating customer request:', error);
    res.status(500).json({ error: 'Failed to update customer request' });
  }
});

// Get shopkeeper dashboard analytics
router.get('/analytics/:shopkeeperId', async (req, res) => {
  try {
    const { shopkeeperId } = req.params;
    
    // Get inventory count
    const inventoryCount = await Inventory.countDocuments({ 
      shopkeeper: shopkeeperId 
    });
    
    // Get low stock items (stock <= 5)
    const lowStockCount = await Inventory.countDocuments({ 
      shopkeeper: shopkeeperId,
      stock: { $lte: 5 }
    });
    
    // Get pending requests count
    const pendingRequestsCount = await CustomerRequest.countDocuments({ 
      shopkeeper: shopkeeperId,
      status: 'pending'
    });
    
    // Get total revenue from completed requests
    const completedRequests = await CustomerRequest.find({ 
      shopkeeper: shopkeeperId,
      status: 'completed'
    });
    
    const totalRevenue = completedRequests.reduce((sum, request) => 
      sum + request.totalAmount, 0
    );
    
    res.json({
      inventoryCount,
      lowStockCount,
      pendingRequestsCount,
      totalRevenue,
      completedOrdersCount: completedRequests.length
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;

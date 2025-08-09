const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'shopkeeper'],
    default: 'customer'
  },
  shopCode: {
    type: String,
    unique: true,
    sparse: true // Only for shopkeepers
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  // For customers: list of added/favorite shops
  shops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }]
}, { timestamps: true });

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shopCode: {
    type: String,
    required: true,
    unique: true
  },
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Grocery', 'Electronics', 'Clothing', 'Pharmacy', 'Books', 'Other'],
    default: 'Grocery'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const inventorySchema = new mongoose.Schema({
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Beverages', 'Snacks', 'Household', 'Other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const customerRequestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    itemName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  requestMessage: {
    type: String,
    trim: true
  },
  responseMessage: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Shop = mongoose.model('Shop', shopSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);
const CustomerRequest = mongoose.model('CustomerRequest', customerRequestSchema);

module.exports = { User, Shop, Inventory, CustomerRequest };
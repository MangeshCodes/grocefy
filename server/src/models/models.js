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

module.exports = mongoose.model('User', userSchema);
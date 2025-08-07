require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/item');
const connectDB = require('../config/db');

const sampleItems = [
  {
    shopName: 'Fresh Mart',
    itemName: 'Tomato',
    imageUrl: 'https://cdn.zeptonow.com/production///tr:w-200,ar-200-200,pr-true,f-webp,q-80/inventory/product/4e2e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e-tomato.png',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: 30
  },
  {
    shopName: 'Veggie Hub',
    itemName: 'Potato',
    imageUrl: 'https://cdn.zeptonow.com/production///tr:w-200,ar-200-200,pr-true,f-webp,q-80/inventory/product/4e2e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e-potato.png',
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    price: 20
  },
  {
    shopName: 'Dairy Best',
    itemName: 'Milk',
    imageUrl: 'https://cdn.zeptonow.com/production///tr:w-200,ar-200-200,pr-true,f-webp,q-80/inventory/product/4e2e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e-milk.png',
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    price: 50
  },
  {
    shopName: 'Bakery Lane',
    itemName: 'Bread',
    imageUrl: 'https://cdn.zeptonow.com/production///tr:w-200,ar-200-200,pr-true,f-webp,q-80/inventory/product/4e2e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e-bread.png',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    price: 40
  },
  {
    shopName: 'Egg World',
    itemName: 'Eggs',
    imageUrl: 'https://cdn.zeptonow.com/production///tr:w-200,ar-200-200,pr-true,f-webp,q-80/inventory/product/4e2e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e-eggs.png',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    price: 60
  }
];

async function seedItems() {
  await connectDB();
  await Item.deleteMany({});
  await Item.insertMany(sampleItems);
  console.log('Sample items inserted!');
  mongoose.connection.close();
}

seedItems();

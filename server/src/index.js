// filepath: c:\Users\mange\Desktop\All\WebD\WebD Projects\Grocefy\server\src\index.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const shopRoutes = require('./routes/shopRoutes');
const connectDB = require('./config/db');
connectDB();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/users', userRoutes);
// Test route

app.get('/', (req, res) => {
  res.send('Grocefy API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
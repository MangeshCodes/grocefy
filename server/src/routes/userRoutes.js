
const express = require('express');
const router = express.Router();
const { User } = require('../models/models');
const bcrypt = require('bcryptjs');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let userData = { name, email, password: hashedPassword, role };

        if (role === 'shopkeeper') {
            // Generate unique 7-digit shop code
            let unique = false;
            let shopCode;
            while (!unique) {
                shopCode = Math.floor(1000000 + Math.random() * 9000000).toString();
                const codeExists = await User.findOne({ shopCode });
                if (!codeExists) unique = true;
            }
            userData.shopCode = shopCode;
            userData.paymentStatus = 'pending'; // Simulate payment pending
        }

        const user = new User(userData);
        await user.save();

        let responseUser = { _id: user._id, name: user.name, email: user.email, role: user.role };
        if (user.role === 'shopkeeper') {
            responseUser.shopCode = user.shopCode;
            responseUser.paymentStatus = user.paymentStatus;
        }

        res.status(201).json({ message: 'User registered successfully', user: responseUser });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        // Find user by email and role
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Prepare user response
        let responseUser = { 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
        };
        
        if (user.role === 'shopkeeper') {
            responseUser.shopCode = user.shopCode;
            responseUser.paymentStatus = user.paymentStatus;
        }

        res.json({ 
            message: 'Login successful', 
            user: responseUser 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
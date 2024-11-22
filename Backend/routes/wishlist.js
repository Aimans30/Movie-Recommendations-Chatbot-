const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

// Authentication middleware
const authenticateUser = (req, res, next) => {
    try {
        // Simulating user authentication for testing purposes
        req.user = { _id: '1234567890abcdef12345678' }; // Replace with actual user from token/session
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
};

// Validation middleware
const validateWishlistItem = (req, res, next) => {
    const { type, title } = req.body;
    const errors = [];

    if (!type || !['movie', 'game'].includes(type)) {
        errors.push('Invalid type. Must be "movie" or "game".');
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push('Valid title is required.');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    req.body.title = title.trim();
    req.body.details = req.body.details ? req.body.details.trim() : '';
    next();
};

// Add item to wishlist
router.post('/add', authenticateUser, validateWishlistItem, async (req, res, next) => {
    try {
        const { type, title, details } = req.body;

        let wishlist = await Wishlist.findOne({ userId: req.user._id });
        if (!wishlist) {
            wishlist = new Wishlist({ userId: req.user._id, items: [] });
        }

        const existingItem = wishlist.items.find(
            item => item.type === type && item.title.toLowerCase() === title.toLowerCase()
        );

        if (existingItem) {
            return res.status(400).json({ message: 'Item already exists in your wishlist.' });
        }

        wishlist.items.push({ type, title, details });
        await wishlist.save();

        res.status(201).json({ message: 'Item added successfully', item: wishlist.items[wishlist.items.length - 1] });
    } catch (error) {
        next(error);
    }
});

// Get wishlist
router.get('/', authenticateUser, async (req, res, next) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user._id }).select('items').lean();
        res.status(200).json({ items: wishlist ? wishlist.items : [], count: wishlist ? wishlist.items.length : 0 });
    } catch (error) {
        next(error);
    }
});

// Remove item from wishlist
router.delete('/remove', authenticateUser, validateWishlistItem, async (req, res, next) => {
    try {
        const { type, title } = req.body;

        const wishlist = await Wishlist.findOne({ userId: req.user._id });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const initialLength = wishlist.items.length;
        wishlist.items = wishlist.items.filter(
            item => !(item.type === type && item.title.toLowerCase() === title.toLowerCase())
        );

        if (wishlist.items.length === initialLength) {
            return res.status(404).json({ message: 'Item not found in wishlist' });
        }

        await wishlist.save();
        res.status(200).json({ message: 'Item removed successfully', remainingItems: wishlist.items.length });
    } catch (error) {
        next(error);
    }
});

router.use(errorHandler);

module.exports = router;

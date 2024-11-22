const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            type: { type: String, enum: ['movie', 'game'], required: true },
            title: { type: String, required: true },
            details: { type: Object, default: {} },
        },
    ],
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;

const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get user's wishlist
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Add product to wishlist
router.post('/:productId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        if (user.wishlist.includes(req.params.productId)) {
            return res.status(400).json({ msg: 'Product already in wishlist' });
        }

        user.wishlist.push(req.params.productId);
        await user.save();
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Remove product from wishlist
router.delete('/:productId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
        await user.save();
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;

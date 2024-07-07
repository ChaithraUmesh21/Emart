const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get user's cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product');
        res.json(user.cart);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Add product to cart
router.post('/:productId', authMiddleware, async (req, res) => {
    const { quantity } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        const cartItem = user.cart.find(item => item.product.toString() === req.params.productId);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            user.cart.push({ product: req.params.productId, quantity });
        }

        await user.save();
        res.json(user.cart);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update product quantity in cart
router.put('/:productId', authMiddleware, async (req, res) => {
    const { quantity } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const cartItem = user.cart.find(item => item.product.toString() === req.params.productId);

        if (!cartItem) {
            return res.status(404).json({ msg: 'Product not in cart' });
        }

        cartItem.quantity = quantity;
        await user.save();
        res.json(user.cart);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Remove product from cart
router.delete('/:productId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
        await user.save();
        res.json(user.cart);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;

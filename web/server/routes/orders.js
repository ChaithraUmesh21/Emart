const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create an order
router.post('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { cart } = req.body;

        // Check product stock and update stock count
        for (const item of cart) {
            const product = await Product.findById(item.product._id);
            if (product.stock < item.quantity) {
                return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
            }
            product.stock -= item.quantity;
            await product.save();
        }

        // Create a new order
        const order = new Order({
            user: req.user.id,
            products: cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            total: cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
        });

        await order.save();

        // Clear the user's cart
        user.cart = [];
        await user.save();

        res.json(order);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get all orders for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('products.product');
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Get all products or filter by category
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }
        if (minPrice) {
            query.price = { ...query.price, $gte: Number(minPrice) };
        }
        if (maxPrice) {
            query.price = { ...query.price, $lte: Number(maxPrice) };
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Add a new product
router.post('/', upload.single('image'), async (req, res) => {
    const { name, category, price, stock, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        let product = new Product({
            name,
            category,
            price,
            stock,
            description,
            image
        });

        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update a product
router.put('/:id', upload.single('image'), async (req, res) => {
    const { name, category, price, stock, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        product.name = name;
        product.category = category;
        product.price = price;
        product.stock = stock;
        product.description = description;
        if (image) product.image = image;

        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error('Error while deleting product:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

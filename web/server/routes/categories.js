const express = require('express');
const router = express.Router();

const categories = ['Smartphones', 'Laptops', 'Tablets', 'Accessories'];

router.get('/', (req, res) => {
    res.json(categories);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   GET /api/products
// @desc    Get all products (with optional search, category filter, and sorting)
router.get('/', async (req, res) => {
    try {
        const { search, category, sort, minPrice, maxPrice } = req.query;
        let queryStr = 'SELECT * FROM products WHERE 1=1';
        let params = [];
        let paramIndex = 1;

        if (search) {
            queryStr += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        if (category) {
            queryStr += ` AND category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }
        if (minPrice) {
            queryStr += ` AND price >= $${paramIndex}`;
            params.push(parseFloat(minPrice));
            paramIndex++;
        }
        if (maxPrice) {
            queryStr += ` AND price <= $${paramIndex}`;
            params.push(parseFloat(maxPrice));
            paramIndex++;
        }

        // Sorting
        const sortOptions = {
            price_asc:  'ORDER BY price ASC',
            price_desc: 'ORDER BY price DESC',
            rating:     'ORDER BY rating DESC, rating_count DESC',
            newest:     'ORDER BY created_at DESC',
        };
        queryStr += ` ${sortOptions[sort] || 'ORDER BY created_at DESC'}`;

        const products = await db.query(queryStr, params);
        res.json(products.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/products/categories
// @desc    Get all distinct categories
router.get('/categories', async (req, res) => {
    try {
        const cats = await db.query('SELECT DISTINCT category FROM products ORDER BY category ASC');
        res.json(cats.rows.map(r => r.category));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/products/suggestions
// @desc    Search suggestions (lightweight, top 6 matches by name)
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) return res.json([]);
        const results = await db.query(
            'SELECT id, name, category, price, image_url FROM products WHERE name ILIKE $1 ORDER BY rating_count DESC LIMIT 6',
            [`${q}%`]
        );
        res.json(results.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

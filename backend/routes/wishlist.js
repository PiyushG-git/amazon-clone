const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET api/wishlist
// @desc    Get user wishlist
router.get('/', auth, async (req, res) => {
    try {
        const wishlist = await db.query(`
            SELECT w.id as wishlist_id, p.* 
            FROM wishlist_items w 
            JOIN products p ON w.product_id = p.id 
            WHERE w.user_id = $1
            ORDER BY w.id ASC
        `, [req.user.id]);
        res.json(wishlist.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/wishlist
// @desc    Add item to wishlist
router.post('/', auth, async (req, res) => {
    try {
        const { product_id } = req.body;
        
        // Check if already in wishlist
        const existing = await db.query('SELECT * FROM wishlist_items WHERE user_id = $1 AND product_id = $2', [req.user.id, product_id]);
        if (existing.rows.length === 0) {
            await db.query('INSERT INTO wishlist_items (user_id, product_id) VALUES ($1, $2)', [req.user.id, product_id]);
        }
        res.json({ message: 'Item added to wishlist' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/wishlist/:id
// @desc    Remove from wishlist
router.delete('/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM wishlist_items WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ message: 'Item removed from wishlist' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

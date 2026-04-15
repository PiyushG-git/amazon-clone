const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET api/cart
// @desc    Get user cart
router.get('/', auth, async (req, res) => {
    try {
        const cart = await db.query(`
            SELECT c.id as cart_item_id, c.quantity, p.* 
            FROM cart_items c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = $1
            ORDER BY c.id ASC
        `, [req.user.id]);
        res.json(cart.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/cart
// @desc    Add item to cart
router.post('/', auth, async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        
        // Check if item already in cart
        const existing = await db.query('SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2', [req.user.id, product_id]);
        
        if (existing.rows.length > 0) {
            // Update quantity
            const newQty = existing.rows[0].quantity + (quantity || 1);
            await db.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [newQty, existing.rows[0].id]);
        } else {
            // Insert new item
            await db.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)', [req.user.id, product_id, quantity || 1]);
        }
        
        res.json({ message: 'Item added to cart' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/cart/:id
// @desc    Update cart item quantity
router.put('/:id', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        // Verify user owns cart item using id, but id here is cart_item_id
        const item = await db.query('SELECT * FROM cart_items WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (item.rows.length === 0) return res.status(404).json({ message: 'Item not found in cart' });

        await db.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [quantity, req.params.id]);
        res.json({ message: 'Cart updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/cart/:id
// @desc    Remove cart item
router.delete('/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

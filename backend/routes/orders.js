const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order and clear cart
router.post('/', auth, async (req, res) => {
    const { shipping_address, direct_product_id, direct_quantity } = req.body;

    if (!shipping_address || !shipping_address.trim()) {
        return res.status(400).json({ message: 'Shipping address is required' });
    }

    try {
        await db.query('BEGIN');

        let pendingItems = [];

        if (direct_product_id && direct_quantity) {
            // BUY NOW MODE
            const directProduct = await db.query('SELECT * FROM products WHERE id = $1', [direct_product_id]);
            if (directProduct.rows.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json({ message: 'Product not found' });
            }
            pendingItems.push({
                product_id: direct_product_id,
                price: directProduct.rows[0].price,
                quantity: direct_quantity,
                stock: directProduct.rows[0].stock,
                name: directProduct.rows[0].name,
                image_url: directProduct.rows[0].image_url
            });
        } else {
            // CART CHECKOUT MODE
            const cart = await db.query(`
                SELECT c.*, p.price, p.stock, p.name, p.image_url
                FROM cart_items c
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = $1
            `, [req.user.id]);

            if (cart.rows.length === 0) {
                await db.query('ROLLBACK');
                return res.status(400).json({ message: 'Cart is empty' });
            }
            pendingItems = cart.rows;
        }

        // Validate stock and calculate total
        let total_price = 0;
        for (let item of pendingItems) {
            if (item.stock < item.quantity) {
                await db.query('ROLLBACK');
                return res.status(400).json({ message: `Insufficient stock for "${item.name}"` });
            }
            total_price += parseFloat(item.price) * parseInt(item.quantity);
        }

        // Create order
        const order = await db.query(
            'INSERT INTO orders (user_id, total_price, shipping_address) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, total_price, shipping_address.trim()]
        );
        const orderId = order.rows[0].id;

        // Insert order items and reduce stock
        for (let item of pendingItems) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );
            await db.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
        }

        // Clear cart only in cart-checkout mode
        if (!direct_product_id) {
            await db.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
        }

        await db.query('COMMIT');

        res.json({ message: 'Order placed successfully', order_id: orderId, order: order.rows[0] });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/orders
// @desc    Get user order history
router.get('/', auth, async (req, res) => {
    try {
        const orders = await db.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );

        for (let order of orders.rows) {
            const items = await db.query(`
                SELECT oi.*, p.name, p.image_url
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = $1
            `, [order.id]);
            order.items = items.rows;
        }

        res.json(orders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID (user must own the order)
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await db.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );

        if (order.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const items = await db.query(`
            SELECT oi.*, p.name, p.image_url, p.category
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1
        `, [req.params.id]);

        const result = { ...order.rows[0], items: items.rows };
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

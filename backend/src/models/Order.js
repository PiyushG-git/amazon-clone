import db from '../config/db.js';

class Order {
    /**
     * Creates an order in a proper PostgreSQL transaction.
     * IMPORTANT: Must use a single dedicated client for BEGIN/COMMIT/ROLLBACK
     * to work correctly — pool.query() uses random clients each time.
     */
    static async create(userId, totalPrice, shippingAddress, items) {
        // Checkout a dedicated client from the pool for this transaction
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const orderResult = await client.query(
                'INSERT INTO orders (user_id, total_price, shipping_address) VALUES ($1, $2, $3) RETURNING *',
                [userId, totalPrice, shippingAddress]
            );
            const orderId = orderResult.rows[0].id;

            for (let item of items) {
                await client.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
                    [orderId, item.product_id, item.quantity, item.price]
                );
                await client.query(
                    'UPDATE products SET stock = stock - $1 WHERE id = $2',
                    [item.quantity, item.product_id]
                );
            }

            await client.query('COMMIT');
            return orderResult.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            // Always release the client back to the pool
            client.release();
        }
    }

    /**
     * Fetch all orders for a user with their items in a single optimized query
     * (avoids N+1 query problem from the previous implementation).
     */
    static async findByUserId(userId) {
        // Fetch all orders
        const ordersResult = await db.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        const orders = ordersResult.rows;
        if (orders.length === 0) return [];

        // Fetch ALL items for all orders in a single query
        const orderIds = orders.map(o => o.id);
        const itemsResult = await db.query(
            `SELECT oi.*, p.name, p.image_url
             FROM order_items oi
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ANY($1::int[])`,
            [orderIds]
        );

        // Group items by order_id
        const itemsByOrder = {};
        for (const item of itemsResult.rows) {
            if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
            itemsByOrder[item.order_id].push(item);
        }

        // Attach items to each order
        return orders.map(order => ({
            ...order,
            items: itemsByOrder[order.id] || []
        }));
    }

    static async findById(id, userId) {
        const result = await db.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (result.rows.length === 0) return null;

        const order = result.rows[0];
        const itemsResult = await db.query(
            `SELECT oi.*, p.name, p.image_url, p.category
             FROM order_items oi
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = $1`,
            [id]
        );

        return { ...order, items: itemsResult.rows };
    }

    static async updateStatus(id, status) {
        const result = await db.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows[0];
    }
}

export default Order;

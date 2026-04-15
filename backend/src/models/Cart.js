import db from '../config/db.js';

class Cart {
    static async findByUserId(userId) {
        const result = await db.query(`
            SELECT c.id as cart_item_id, c.quantity, p.* 
            FROM cart_items c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = $1
            ORDER BY c.id ASC
        `, [userId]);
        return result.rows;
    }

    static async addItem(userId, productId, quantity = 1) {
        const existing = await db.query(
            'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        if (existing.rows.length > 0) {
            const newQty = existing.rows[0].quantity + quantity;
            await db.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [newQty, existing.rows[0].id]);
        } else {
            await db.query(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
                [userId, productId, quantity]
            );
        }
    }

    static async updateQuantity(userId, cartItemId, quantity) {
        const result = await db.query(
            'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, cartItemId, userId]
        );
        return result.rows[0];
    }

    static async removeItem(userId, cartItemId) {
        await db.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [cartItemId, userId]);
    }

    static async clear(userId) {
        await db.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    }
}

export default Cart;

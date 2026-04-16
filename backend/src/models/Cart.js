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
        // Fetch product stock first
        const productRes = await db.query('SELECT stock FROM products WHERE id = $1', [productId]);
        if (productRes.rows.length === 0) throw { status: 404, message: "Product not found" };
        const stock = productRes.rows[0].stock;

        const existing = await db.query(
            'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        if (existing.rows.length > 0) {
            const newQty = existing.rows[0].quantity + quantity;
            if (newQty > stock) {
                throw { status: 400, message: "Cannot add more items than available in stock" };
            }
            await db.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [newQty, existing.rows[0].id]);
        } else {
            if (quantity > stock) {
                throw { status: 400, message: "Insufficient stock" };
            }
            await db.query(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
                [userId, productId, quantity]
            );
        }
    }

    static async updateQuantity(userId, cartItemId, quantity) {
        // Fetch product stock first by joining cart_items
        const checkRes = await db.query(
            'SELECT p.stock FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.id = $1 AND c.user_id = $2', 
            [cartItemId, userId]
        );
        if (checkRes.rows.length === 0) throw { status: 404, message: "Cart item not found" };
        if (checkRes.rows[0].stock < quantity) {
            throw { status: 400, message: "Cannot update quantity, insufficient stock available" };
        }

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

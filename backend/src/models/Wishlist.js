import db from '../config/db.js';

class Wishlist {
    static async findByUserId(userId) {
        const result = await db.query(`
            SELECT w.id as wishlist_id, w.product_id, p.name, p.description, p.price, p.stock, p.category, p.image_url, p.rating, p.rating_count
            FROM wishlist_items w 
            JOIN products p ON w.product_id = p.id 
            WHERE w.user_id = $1
            ORDER BY w.id ASC
        `, [userId]);
        return result.rows;
    }

    static async addItem(userId, productId) {
        const existing = await db.query(
            'SELECT * FROM wishlist_items WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );
        if (existing.rows.length === 0) {
            await db.query('INSERT INTO wishlist_items (user_id, product_id) VALUES ($1, $2)', [userId, productId]);
        }
    }

    static async removeItem(userId, wishlistId) {
        await db.query('DELETE FROM wishlist_items WHERE id = $1 AND user_id = $2', [wishlistId, userId]);
    }
}

export default Wishlist;

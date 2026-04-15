import db from '../config/db.js';

class Product {
    static async findAll({ search, category, sort, minPrice, maxPrice, limit }) {
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

        const sortOptions = {
            price_asc:  'ORDER BY price ASC',
            price_desc: 'ORDER BY price DESC',
            rating:     'ORDER BY rating DESC, rating_count DESC',
            newest:     'ORDER BY created_at DESC',
        };
        queryStr += ` ${sortOptions[sort] || 'ORDER BY created_at DESC'}`;

        if (limit) {
            queryStr += ` LIMIT $${paramIndex}`;
            params.push(parseInt(limit));
            paramIndex++;
        }

        const result = await db.query(queryStr, params);
        return result.rows;
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async findCategories() {
        const result = await db.query('SELECT DISTINCT category FROM products ORDER BY category ASC');
        return result.rows.map(r => r.category);
    }

    static async findSuggestions(q) {
        const result = await db.query(
            'SELECT id, name, category, price, image_url FROM products WHERE name ILIKE $1 ORDER BY rating_count DESC LIMIT 6',
            [`${q}%`]
        );
        return result.rows;
    }

    static async updateStock(productId, quantityChange) {
        await db.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [quantityChange, productId]);
    }
}

export default Product;

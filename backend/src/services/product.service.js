import Product from '../models/Product.js';

class ProductService {
    static async getAllProducts(filters) {
        return await Product.findAll(filters);
    }

    static async getCategories() {
        return await Product.findCategories();
    }

    static async getSuggestions(query) {
        if (!query || query.trim().length < 2) return [];
        return await Product.findSuggestions(query.trim());
    }

    static async getProductById(id) {
        const product = await Product.findById(id);
        if (!product) {
            throw { status: 404, message: 'Product not found' };
        }
        return product;
    }
}

export default ProductService;

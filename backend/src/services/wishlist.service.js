import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

class WishlistService {
    static async getWishlist(userId) {
        return await Wishlist.findByUserId(userId);
    }

    static async addItemToWishlist(userId, product_id) {
        const product = await Product.findById(product_id);
        if (!product) {
            throw { status: 404, message: 'Product not found' };
        }
        await Wishlist.addItem(userId, product_id);
        return { message: 'Item added to wishlist' };
    }

    static async removeItem(userId, wishlistId) {
        await Wishlist.removeItem(userId, wishlistId);
        return { message: 'Item removed from wishlist' };
    }
}

export default WishlistService;

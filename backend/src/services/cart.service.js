import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

class CartService {
    static async getCart(userId) {
        return await Cart.findByUserId(userId);
    }

    static async addItemToCart(userId, { product_id, quantity }) {
        await Cart.addItem(userId, product_id, quantity || 1);
        return { message: 'Item added to cart' };
    }

    static async updateItemQuantity(userId, cartItemId, quantity) {
        const updated = await Cart.updateQuantity(userId, cartItemId, quantity);
        if (!updated) {
            throw { status: 404, message: 'Item not found in cart' };
        }
        return { message: 'Cart updated' };
    }

    static async removeItem(userId, cartItemId) {
        await Cart.removeItem(userId, cartItemId);
        return { message: 'Item removed from cart' };
    }
}

export default CartService;

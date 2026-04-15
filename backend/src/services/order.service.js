import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

class OrderService {
    /**
     * Business logic for creating an order
     * Handles stock validation, price calculation, and cart clearing.
     */
    static async processOrderCreation(userId, { shipping_address, direct_product_id, direct_quantity }) {
        let pendingItems = [];

        if (direct_product_id && direct_quantity) {
            // BUY NOW MODE
            const product = await Product.findById(direct_product_id);
            if (!product) {
                throw { status: 404, message: 'Product not found' };
            }
            pendingItems.push({
                product_id: direct_product_id,
                price: product.price,
                quantity: direct_quantity,
                stock: product.stock,
                name: product.name,
                image_url: product.image_url
            });
        } else {
            // CART CHECKOUT MODE
            const cartItems = await Cart.findByUserId(userId);
            if (cartItems.length === 0) {
                throw { status: 400, message: 'Cart is empty' };
            }
            pendingItems = cartItems.map(item => ({
                product_id: item.id || item.product_id, 
                price: item.price,
                quantity: item.quantity,
                stock: item.stock,
                name: item.name,
                image_url: item.image_url
            }));
        }

        // Validate stock and calculate total
        let total_price = 0;
        for (let item of pendingItems) {
            if (item.stock < item.quantity) {
                throw { status: 400, message: `Insufficient stock for "${item.name}"` };
            }
            total_price += parseFloat(item.price) * parseInt(item.quantity);
        }

        // Database transaction
        const order = await Order.create(userId, total_price, shipping_address.trim(), pendingItems);

        // Post-order cleanup
        if (!direct_product_id) {
            await Cart.clear(userId);
        }

        return order;
    }

    static async getUserOrders(userId) {
        return await Order.findByUserId(userId);
    }

    static async getOrderById(orderId, userId) {
        const order = await Order.findById(orderId, userId);
        if (!order) {
            throw { status: 404, message: 'Order not found' };
        }
        return order;
    }
}

export default OrderService;

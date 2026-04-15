import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import { sendEmail } from './mail.service.js';

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

        // Fetch user info for email
        const user = await User.findById(userId);
        if (user) {
            sendEmail({
                to: user.email,
                subject: `Order Placed Successfully! (Order #${order.id})`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ddd; padding: 20px;">
                        <h2 style="color: #232f3e;">Hello ${user.name},</h2>
                        <p>Thank you for shopping with Amazon Clone! Your order has been placed successfully.</p>
                        <div style="background: #f3f3f3; padding: 15px; border-radius: 4px; margin: 20px 0;">
                            <p><strong>Order ID:</strong> #${order.id}</p>
                            <p><strong>Total Price:</strong> ₹${parseFloat(total_price).toLocaleString('en-IN')}</p>
                            <p><strong>Shipping to:</strong> ${shipping_address}</p>
                        </div>
                        <p>We'll notify you as soon as your items are on their way!</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 0.85rem; color: #565959;">Amazon Clone - Project by Piyush Gupta</p>
                    </div>
                `,
                text: `Hello ${user.name}, your order #${order.id} for ₹${total_price} has been placed successfully!`
            }).catch(err => console.error("Async email failed:", err)); // Non-blocking
        }

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

    static async updateOrderStatus(orderId, status) {
        const allowedStatuses = ['Pending', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            throw { status: 400, message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` };
        }
        
        const order = await Order.updateStatus(orderId, status);
        if (!order) {
            throw { status: 404, message: 'Order not found' };
        }

        // Fetch user info for status update email
        const user = await User.findById(order.user_id);
        if (user) {
            const statusToSubject = {
                'Shipped': 'Your order has been Shipped!',
                'Out for Delivery': 'Your order is Out for Delivery!',
                'Delivered': 'Order Delivered successfully!',
                'Cancelled': 'Your order has been Cancelled'
            };

            const statusToPrefix = {
                'Shipped': 'Great news!',
                'Out for Delivery': 'Almost there!',
                'Delivered': 'Success!',
                'Cancelled': 'Important notice:'
            };

            if (statusToSubject[status]) {
                sendEmail({
                    to: user.email,
                    subject: `${statusToSubject[status]} (Order #${order.id})`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ddd; padding: 20px;">
                            <h2 style="color: #232f3e;">${statusToPrefix[status] || 'Update:'}</h2>
                            <p>Hi ${user.name}, the status of your order <strong>#${order.id}</strong> has been updated to: <span style="font-weight: bold; color: #c45500;">${status}</span>.</p>
                            <p>Check the status of your order anytime in your account.</p>
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/orders" style="display: inline-block; background: #FFD814; border: 1px solid #FCD200; border-radius: 8px; padding: 10px 20px; text-decoration: none; color: #111; font-weight: 500; margin-top: 15px;">View Order History</a>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 20px 0;" />
                            <p style="font-size: 0.85rem; color: #565959;">Amazon Clone - Project by Piyush Gupta</p>
                        </div>
                    `,
                    text: `Hi ${user.name}, your order #${order.id} status is now: ${status}.`
                }).catch(err => console.error("Async status email failed:", err));
            }
        }

        return order;
    }
}

export default OrderService;

import OrderService from '../services/order.service.js';

export const createOrder = async (req, res, next) => {
    try {
        const order = await OrderService.processOrderCreation(req.user.id, req.body);
        res.status(201).json({ 
            message: 'Order placed successfully', 
            order_id: order.id, 
            order 
        });
    } catch (err) {
        next(err); // Pass to global error handler
    }
};

export const getOrderHistory = async (req, res, next) => {
    try {
        const orders = await OrderService.getUserOrders(req.user.id);
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await OrderService.getOrderById(req.params.id, req.user.id);
        res.json(order);
    } catch (err) {
        next(err);
    }
};

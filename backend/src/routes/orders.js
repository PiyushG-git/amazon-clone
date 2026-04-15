import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { createOrderValidator } from '../validators/order.validator.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order and clear cart
router.post('/', auth, createOrderValidator, orderController.createOrder);

// @route   GET /api/orders
// @desc    Get user order history
router.get('/', auth, orderController.getOrderHistory);

// @route   GET /api/orders/:id
// @desc    Get single order by ID
router.get('/:id', auth, orderController.getOrderById);

// @route   PATCH /api/orders/:id/status/:status?
// @desc    Update order status (Flexible route - No Auth for testing)
router.patch('/:id/status/:status?', orderController.updateOrderStatus);

export default router;

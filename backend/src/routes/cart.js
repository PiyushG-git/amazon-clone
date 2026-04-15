import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { addToCartValidator, updateCartValidator } from '../validators/cart.validator.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/cart
// @desc    Get user cart
router.get('/', auth, cartController.getCart);

// @route   POST api/cart
// @desc    Add item to cart
router.post('/', auth, addToCartValidator, cartController.addToCart);

// @route   PUT api/cart/:id
// @desc    Update cart item quantity
router.put('/:id', auth, updateCartValidator, cartController.updateCartItem);

// @route   DELETE api/cart/:id
// @desc    Remove cart item
router.delete('/:id', auth, cartController.removeCartItem);

export default router;

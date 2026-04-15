import express from 'express';
import * as wishlistController from '../controllers/wishlist.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/wishlist
// @desc    Get user wishlist
router.get('/', auth, wishlistController.getWishlist);

// @route   POST api/wishlist
// @desc    Add item to wishlist
router.post('/', auth, wishlistController.addToWishlist);

// @route   DELETE api/wishlist/:id
// @desc    Remove from wishlist
router.delete('/:id', auth, wishlistController.removeFromWishlist);

export default router;

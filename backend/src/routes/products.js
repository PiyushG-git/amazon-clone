import express from 'express';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
router.get('/', productController.getProducts);

// @route   GET /api/products/categories
// @desc    Get all distinct categories
router.get('/categories', productController.getCategories);

// @route   GET /api/products/suggestions
// @desc    Search suggestions
router.get('/suggestions', productController.getSuggestions);

// @route   GET /api/products/:id
// @desc    Get single product
router.get('/:id', productController.getProductById);

export default router;

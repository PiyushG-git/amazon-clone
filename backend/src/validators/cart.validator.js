import { body, validationResult } from 'express-validator';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const addToCartValidator = [
    body('product_id', 'Product ID is required').not().isEmpty(),
    body('quantity', 'Quantity must be a positive integer').optional().isInt({ min: 1 }),
    validate
];

export const updateCartValidator = [
    body('quantity', 'Quantity must be a positive integer').isInt({ min: 1 }),
    validate
];

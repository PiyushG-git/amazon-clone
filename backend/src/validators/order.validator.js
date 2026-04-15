import { body, validationResult } from 'express-validator';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const createOrderValidator = [
    body('shipping_address', 'Shipping address is required').not().isEmpty(),
    body('shipping_address', 'Shipping address must be at least 10 characters').isLength({ min: 10 }),
    body('direct_quantity', 'Quantity must be a positive integer').optional().isInt({ min: 1 }),
    validate
];

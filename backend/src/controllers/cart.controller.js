import CartService from '../services/cart.service.js';

export const getCart = async (req, res, next) => {
    try {
        const cart = await CartService.getCart(req.user.id);
        res.json(cart);
    } catch (err) {
        next(err);
    }
};

export const addToCart = async (req, res, next) => {
    try {
        const result = await CartService.addItemToCart(req.user.id, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const updateCartItem = async (req, res, next) => {
    try {
        const result = await CartService.updateItemQuantity(req.user.id, req.params.id, req.body.quantity);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const removeCartItem = async (req, res, next) => {
    try {
        const result = await CartService.removeItem(req.user.id, req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

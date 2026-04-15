import WishlistService from '../services/wishlist.service.js';

export const getWishlist = async (req, res, next) => {
    try {
        const wishlist = await WishlistService.getWishlist(req.user.id);
        res.json(wishlist);
    } catch (err) {
        next(err);
    }
};

export const addToWishlist = async (req, res, next) => {
    try {
        const result = await WishlistService.addItemToWishlist(req.user.id, req.body.product_id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const removeFromWishlist = async (req, res, next) => {
    try {
        const result = await WishlistService.removeItem(req.user.id, req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

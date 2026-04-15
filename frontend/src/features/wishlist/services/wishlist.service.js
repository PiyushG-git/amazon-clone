import api from '../../../app/app.api';

const wishlistService = {
    getWishlist: async () => {
        const res = await api.get('/wishlist');
        return res.data;
    },
    addToWishlist: async (product_id) => {
        const res = await api.post('/wishlist', { product_id });
        return res.data;
    },
    removeFromWishlist: async (wishlist_item_id) => {
        const res = await api.delete(`/wishlist/${wishlist_item_id}`);
        return res.data;
    }
};

export default wishlistService;

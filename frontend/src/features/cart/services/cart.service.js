import api from '../../../app/app.api';

const cartService = {
    getCart: async () => {
        const res = await api.get('/cart');
        return res.data;
    },
    addToCart: async (product_id, quantity = 1) => {
        const res = await api.post('/cart', { product_id, quantity });
        return res.data;
    },
    updateQuantity: async (cart_item_id, quantity) => {
        const res = await api.put(`/cart/${cart_item_id}`, { quantity });
        return res.data;
    },
    removeFromCart: async (cart_item_id) => {
        const res = await api.delete(`/cart/${cart_item_id}`);
        return res.data;
    }
};

export default cartService;

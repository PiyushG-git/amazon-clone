import api from '../../../app/app.api';

const productService = {
    getProducts: async (params) => {
        const res = await api.get('/products', { params });
        return res.data;
    },
    getProductById: async (id) => {
        const res = await api.get(`/products/${id}`);
        return res.data;
    },
    getCategories: async () => {
        const res = await api.get('/products/categories');
        return res.data;
    },
    getSuggestions: async (q) => {
        const res = await api.get('/products/suggestions', { params: { q } });
        return res.data;
    }
};

export default productService;

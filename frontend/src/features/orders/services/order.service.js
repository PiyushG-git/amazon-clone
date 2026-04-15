import api from '../../../app/app.api';

const orderService = {
    createOrder: async (orderData) => {
        const res = await api.post('/orders', orderData);
        return res.data;
    },
    getOrders: async () => {
        const res = await api.get('/orders');
        return res.data;
    },
    getOrderById: async (id) => {
        const res = await api.get(`/orders/${id}`);
        return res.data;
    }
};

export default orderService;

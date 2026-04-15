import { useState, useCallback } from 'react';
import orderService from '../services/order.service';

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const placeOrder = async (orderData) => {
        setLoading(true);
        try {
            const result = await orderService.createOrder(orderData);
            setError(null);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getOrderDetails = async (id) => {
        setLoading(true);
        try {
            const data = await orderService.getOrderById(id);
            setError(null);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { orders, loading, error, fetchOrders, placeOrder, getOrderDetails };
};

export default useOrders;

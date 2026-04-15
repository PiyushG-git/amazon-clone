import { useState, useEffect } from 'react';
import productService from '../services/product.service';

const useProducts = (initialParams = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async (params = initialParams) => {
        setLoading(true);
        try {
            const data = await productService.getProducts(params);
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, error, fetchProducts };
};

export default useProducts;

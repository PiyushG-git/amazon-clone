import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const { token, api, user } = useAuth();

    const fetchCart = async () => {
        if (!user) return;
        try {
            const res = await api.get('/cart');
            setCart(res.data);
        } catch (err) { console.error('Failed to fetch cart', err); }
    };

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const res = await api.get('/wishlist');
            setWishlist(res.data);
        } catch (err) { console.error('Failed to fetch wishlist', err); }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
            fetchWishlist();
        } else {
            setCart([]);
            setWishlist([]);
        }
    }, [user, token]);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const addToCart = async (product_id, quantity = 1) => {
        if (!user) return alert("Please login first to add items");
        await api.post('/cart', { product_id, quantity });
        fetchCart();
        setSidebarOpen(true);
    };

    const updateQuantity = async (cart_item_id, quantity) => {
        await api.put(`/cart/${cart_item_id}`, { quantity });
        fetchCart();
    };

    const removeFromCart = async (cart_item_id) => {
        await api.delete(`/cart/${cart_item_id}`);
        fetchCart();
    };

    const addToWishlist = async (product_id) => {
        if (!user) return alert("Please login to use Wishlist");
        await api.post('/wishlist', { product_id });
        fetchWishlist();
    };

    const removeFromWishlist = async (wishlist_item_id) => {
        await api.delete(`/wishlist/${wishlist_item_id}`);
        fetchWishlist();
    };

    const cartTotal = (cart || []).reduce((acc, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 0;
        return acc + (price * qty);
    }, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, updateQuantity, removeFromCart, cartTotal, fetchCart,
            wishlist, addToWishlist, removeFromWishlist,
            isSidebarOpen, setSidebarOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

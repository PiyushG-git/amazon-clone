import { useEffect, useCallback } from 'react';
import useAppStore from '../../../app/app.store';
import cartService from '../services/cart.service';

const useCart = () => {
    // Use individual selectors to avoid object reference re-renders
    const token = useAppStore((state) => state.token);
    const user = useAppStore((state) => state.user);
    const cart = useAppStore((state) => state.cart);
    const setCart = useAppStore((state) => state.setCart);
    const isCartSidebarOpen = useAppStore((state) => state.isCartSidebarOpen);
    const setCartSidebarOpen = useAppStore((state) => state.setCartSidebarOpen);

    const fetchCart = useCallback(async () => {
        if (!token || !user) return;
        try {
            const data = await cartService.getCart();
            setCart(data);
        } catch (err) {
            console.error('Failed to fetch cart', err);
        }
    }, [token, user]); // exclude setCart — it's stable

    useEffect(() => {
        if (token && user) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [token, user]); // exclude fetchCart to avoid loop

    const addToCart = async (product_id, quantity = 1) => {
        if (!user) {
            alert("Please login first to add items");
            return;
        }
        try {
            await cartService.addToCart(product_id, quantity);
            await fetchCart();
            setCartSidebarOpen(true);
        } catch (err) {
            console.error('Failed to add item to cart', err);
        }
    };

    const updateQuantity = async (cart_item_id, quantity) => {
        try {
            await cartService.updateQuantity(cart_item_id, quantity);
            await fetchCart();
        } catch (err) {
            console.error('Failed to update quantity', err);
        }
    };

    const removeFromCart = async (cart_item_id) => {
        try {
            await cartService.removeFromCart(cart_item_id);
            await fetchCart();
        } catch (err) {
            console.error('Failed to remove item', err);
        }
    };

    const cartTotal = (cart || []).reduce((acc, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 0;
        return acc + (price * qty);
    }, 0);

    const cartCount = (cart || []).reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);

    return {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartTotal,
        cartCount,
        fetchCart,
        isSidebarOpen: isCartSidebarOpen,
        setSidebarOpen: setCartSidebarOpen
    };
};

export default useCart;

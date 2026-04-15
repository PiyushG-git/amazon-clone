import { useEffect, useCallback } from 'react';
import useAppStore from '../../../app/app.store';
import wishlistService from '../services/wishlist.service';

const useWishlist = () => {
    // Use individual selectors to avoid object reference re-renders
    const token = useAppStore((state) => state.token);
    const user = useAppStore((state) => state.user);
    const wishlist = useAppStore((state) => state.wishlist);
    const setWishlist = useAppStore((state) => state.setWishlist);

    const fetchWishlist = useCallback(async () => {
        if (!token || !user) return;
        try {
            const data = await wishlistService.getWishlist();
            setWishlist(data);
        } catch (err) {
            console.error('Failed to fetch wishlist', err);
        }
    }, [token, user]); // exclude setWishlist — it's stable

    useEffect(() => {
        if (token && user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [token, user]); // exclude fetchWishlist to avoid loop

    const addToWishlist = async (product_id) => {
        if (!user) {
            alert("Please login to use Wishlist");
            return;
        }
        try {
            await wishlistService.addToWishlist(product_id);
            await fetchWishlist();
        } catch (err) {
            console.error('Failed to add to wishlist', err);
        }
    };

    const removeFromWishlist = async (wishlist_item_id) => {
        try {
            await wishlistService.removeFromWishlist(wishlist_item_id);
            await fetchWishlist();
        } catch (err) {
            console.error('Failed to remove from wishlist', err);
        }
    };

    const isInWishlist = (product_id) => {
        return (wishlist || []).some(item => item.product_id === product_id);
    };

    return {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist
    };
};

export default useWishlist;

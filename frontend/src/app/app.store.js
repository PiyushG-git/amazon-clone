import { create } from 'zustand';

const useAppStore = create((set) => ({
    // Auth State
    user: null,
    token: localStorage.getItem('token') || '',
    authLoading: true,
    setUser: (user) => set({ user }),
    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        set({ token });
    },
    setAuthLoading: (loading) => set({ authLoading: loading }),

    // Cart State
    cart: [],
    setCart: (cart) => set({ cart }),
    isCartSidebarOpen: false,
    setCartSidebarOpen: (isOpen) => set({ isCartSidebarOpen: isOpen }),

    // Wishlist State
    wishlist: [],
    setWishlist: (wishlist) => set({ wishlist }),

    // Global Reset
    resetStore: () => {
        localStorage.removeItem('token');
        set({ user: null, token: '', cart: [], wishlist: [], authLoading: false });
    }
}));

export default useAppStore;

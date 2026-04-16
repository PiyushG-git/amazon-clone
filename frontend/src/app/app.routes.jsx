import React, { lazy, Suspense } from 'react';
import Protected from '../features/auth/components/Protected';

// Lazy load pages for performance
const HomePage = lazy(() => import('../features/products/pages/HomePage'));
const SearchPage = lazy(() => import('../features/products/pages/SearchPage'));
const ProductDetailPage = lazy(() => import('../features/products/pages/ProductDetailPage'));
const AuthPage = lazy(() => import('../features/auth/pages/AuthPage'));
const CartPage = lazy(() => import('../features/cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('../features/cart/pages/CheckoutPage'));
const WishlistPage = lazy(() => import('../features/wishlist/pages/WishlistPage'));
const OrderHistoryPage = lazy(() => import('../features/orders/pages/OrderHistoryPage'));
const OrderConfirmationPage = lazy(() => import('../features/orders/pages/OrderConfirmationPage'));

const routes = [
    { path: '/', element: <HomePage /> },
    { path: '/search', element: <SearchPage /> },
    { path: '/auth', element: <AuthPage /> },
    { path: '/product/:id', element: <ProductDetailPage /> },
    { path: '/cart', element: <CartPage /> },
    { path: '/checkout', element: <Protected><CheckoutPage /></Protected> },
    { path: '/wishlist', element: <Protected><WishlistPage /></Protected> },
    { path: '/orders', element: <Protected><OrderHistoryPage /></Protected> },
    { path: '/order-confirmation/:orderId', element: <Protected><OrderConfirmationPage /></Protected> },
];

export default routes;

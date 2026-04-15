import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import OrderHistory from './pages/OrderHistory';
import OrderConfirmation from './pages/OrderConfirmation';
import Auth from './pages/Auth';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>
          <div className="layout">
            <CartSidebar />
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/"                           element={<Home />} />
                <Route path="/search"                     element={<SearchPage />} />
                <Route path="/auth"                       element={<Auth />} />
                <Route path="/product/:id"                element={<ProductDetail />} />
                <Route path="/cart"                       element={<Cart />} />
                <Route path="/checkout"                   element={<Checkout />} />
                <Route path="/wishlist"                   element={<Wishlist />} />
                <Route path="/orders"                     element={<OrderHistory />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

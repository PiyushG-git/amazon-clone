import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './app.routes';
import useAuthInit from '../features/auth/hooks/useAuthInit';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import CartSidebar from '../features/cart/components/CartSidebar';

function App() {
    // Initialize auth state
    useAuthInit();

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="layout">
                <CartSidebar />
                <Navbar />
                <div className="main-content">
                    <Suspense fallback={
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="amazon-spinner" />
                        </div>
                    }>
                        <Routes>
                            {routes.map((route, index) => (
                                <Route key={index} {...route} />
                            ))}
                        </Routes>
                    </Suspense>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;

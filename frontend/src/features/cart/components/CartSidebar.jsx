import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';

const CartSidebar = () => {
    const { isSidebarOpen, setSidebarOpen, cart, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (!isSidebarOpen) return null;

    return (
        <>
            {/* Dark clickable backdrop overlay */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    zIndex: 9999,
                    animation: 'fadeIn 0.2s ease-out'
                }}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sliding Drawer */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0, right: 0, bottom: 0,
                    width: '100%',
                    maxWidth: '380px',
                    backgroundColor: '#fff',
                    zIndex: 10000,
                    boxShadow: '-5px 0 15px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideLeft 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards'
                }}
            >
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            Subtotal 
                            <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#B12704' }}>
                                ₹{cartTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                            </span>
                        </div>
                        <button 
                            style={{ 
                                width: '100%', padding: '10px', marginTop: '15px',
                                backgroundColor: '#fff', border: '1px solid #D5D9D9',
                                borderRadius: '8px', cursor: 'pointer',
                                fontSize: '13px', boxShadow: '0 2px 5px rgba(213,217,217,.5)'
                            }}
                            onClick={() => {
                                setSidebarOpen(false);
                                navigate('/cart');
                            }}
                        >
                            Go to Cart
                        </button>
                    </div>
                    <button 
                        style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#555' }}
                        onClick={() => setSidebarOpen(false)}
                    >
                        &times;
                    </button>
                </div>

                {/* Cart Items Scroll Container */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', backgroundColor: '#f8f8f8' }}>
                    {cart.length === 0 ? (
                        <div style={{ padding: '20px 0', textAlign: 'center', color: '#555' }}>Your cart is empty.</div>
                    ) : (
                        cart.map(item => (
                            <div key={item.cart_item_id} style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #ddd', backgroundColor: '#fff', marginTop: '15px', padding: '15px', borderRadius: '4px' }}>
                                <img src={item.image_url} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '400', margin: 0, color: '#0f1111' }}>
                                        {item.name ? item.name.substring(0, 45) : 'Amazon Product'}...
                                    </h4>
                                    <div style={{ color: '#B12704', fontWeight: 'bold', fontSize: '16px' }}>
                                        ₹{parseFloat(item.price).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                    </div>
                                    <div style={{ color: '#007600', fontSize: '12px' }}>In Stock</div>
                                    
                                    {/* Qty Controls */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', background: '#f0f2f2', border: '1px solid #D5D9D9', borderRadius: '8px', width: 'fit-content', overflow: 'hidden' }}>
                                        <button 
                                            style={{ border: 'none', background: 'transparent', padding: '5px 12px', cursor: 'pointer', fontSize: '16px' }}
                                            onClick={() => item.quantity > 1 ? updateQuantity(item.cart_item_id, item.quantity - 1) : removeFromCart(item.cart_item_id)}
                                        >
                                            -
                                        </button>
                                        <span style={{ padding: '0 10px', fontSize: '14px', borderLeft: '1px solid #D5D9D9', borderRight: '1px solid #D5D9D9' }}>
                                            {item.quantity}
                                        </span>
                                        <button 
                                            style={{ border: 'none', background: 'transparent', padding: '5px 12px', cursor: 'pointer', fontSize: '16px' }}
                                            onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideLeft {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                    }
                `}</style>
            </div>
        </>
    );
};

export default CartSidebar;

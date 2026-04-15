import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const { api } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${orderId}`);
                setOrder(res.data);
            } catch (err) {
                setError('Could not load order details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, api]);

    const getEstimatedDelivery = () => {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) return (
        <div style={{ background: 'white', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, color: '#565959' }}>Loading order details...</div>
            </div>
        </div>
    );

    if (error || !order) return (
        <div style={{ background: 'white', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 16 }}>{error || 'Order not found.'}</div>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#f3f3f3', minHeight: '100vh', padding: '20px 0' }}>
            <div className="order-confirm-container">
                {/* Header Card */}
                <div className="order-confirm-header">
                    <div className="order-confirm-checkmark">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h1 className="order-confirm-title">Order Placed Successfully!</h1>
                    <p className="order-confirm-id">Order ID: <strong>#{orderId}</strong></p>
                    <p className="order-confirm-delivery">
                        Estimated delivery by <strong>{getEstimatedDelivery()}</strong>
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="order-confirm-card">
                    <div className="order-confirm-card-header">
                        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Order placed</div>
                                <div style={{ fontWeight: 600, color: '#0f1111' }}>
                                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Total</div>
                                <div style={{ fontWeight: 600, color: '#0f1111' }}>
                                    ₹{parseFloat(order.total_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Ship to</div>
                                <div style={{ fontWeight: 600, color: '#007185' }}>
                                    {order.shipping_address.substring(0, 18)}{order.shipping_address.length > 18 ? '…' : ''}
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 11, color: '#565959', marginBottom: 2 }}>ORDER # {orderId}</div>
                            <Link to="/orders" style={{ fontSize: 13, color: '#007185' }}>View order details</Link>
                        </div>
                    </div>

                    <div className="order-confirm-card-body">
                        <div style={{ color: '#007600', fontWeight: 600, marginBottom: 12 }}>
                            Your order is on the way!
                        </div>
                        {order.items && order.items.map(item => (
                            <div className="order-confirm-item" key={item.id}>
                                <img
                                    src={item.image_url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=100'}
                                    alt={item.name || 'Product'}
                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=100'}
                                />
                                <div className="order-confirm-item-info">
                                    <div className="order-confirm-item-name">{item.name || 'Product'}</div>
                                    <div style={{ fontSize: 13, color: '#565959', margin: '2px 0' }}>Qty: {item.quantity}</div>
                                    <div className="order-confirm-item-price">
                                        ₹{parseFloat(item.price_at_purchase).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/orders">
                        <button className="btn btn-primary" style={{ padding: '10px 28px', borderRadius: 8 }}>
                            Track Your Order
                        </button>
                    </Link>
                    <Link to="/">
                        <button className="btn" style={{ padding: '10px 28px', borderRadius: 8, background: '#f0f2f2', border: '1px solid #d5d9d9' }}>
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;

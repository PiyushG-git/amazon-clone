import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useOrders from '../hooks/useOrders';
import useCart from '../../cart/hooks/useCart';

const OrderHistoryPage = () => {
    const { orders, loading, fetchOrders } = useOrders();
    const { addToCart } = useCart();
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        if (orders.length > 0 && expandedOrders.size === 0) {
            setExpandedOrders(new Set([orders[0].id]));
        }
    }, [orders]);

    const toggleExpand = (orderId) => {
        setExpandedOrders(prev => {
            const next = new Set(prev);
            next.has(orderId) ? next.delete(orderId) : next.add(orderId);
            return next;
        });
    };

    const handleBuyAgain = (items) => {
        items.forEach(item => {
            if (item.product_id) addToCart(item.product_id, 1);
        });
    };

    if (loading) return (
        <div className="container" style={{ padding: '2rem' }}>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 120, borderRadius: 8, marginBottom: 16 }} />
            ))}
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1000px' }}>
            <h1 style={{ fontSize: 24, fontWeight: 400, marginBottom: 24 }}>Your Orders</h1>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
                    <h2 style={{ fontSize: 22, marginBottom: 8 }}>No orders yet</h2>
                    <p style={{ color: '#565959', marginBottom: 24 }}>Looks like you haven't placed any orders.</p>
                    <Link to="/">
                        <button className="btn btn-primary" style={{ padding: '10px 28px', borderRadius: 8 }}>
                            Start Shopping
                        </button>
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map(order => {
                        const isExpanded = expandedOrders.has(order.id);
                        const totalItems = (order.items || []).reduce((a, i) => a + i.quantity, 0);

                        return (
                            <div className="order-card" key={order.id}>
                                <div className="order-card-header">
                                    <div className="order-card-header-meta">
                                        <div>
                                            <div className="order-meta-label">Order placed</div>
                                            <div className="order-meta-value">
                                                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="order-meta-label">Total</div>
                                            <div className="order-meta-value">
                                                ₹{parseFloat(order.total_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="order-meta-label">Ship to</div>
                                            <div className="order-meta-value" style={{ color: '#007185' }}>
                                                {order.shipping_address.substring(0, 18)}{order.shipping_address.length > 18 ? '…' : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 11, marginBottom: 4 }}>ORDER # {order.id}</div>
                                        <span
                                            style={{ fontSize: 13, color: '#007185', cursor: 'pointer' }}
                                            onClick={() => toggleExpand(order.id)}
                                        >
                                            {isExpanded ? 'Hide details ▲' : 'View details ▼'}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-card-body">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? 16 : 0 }}>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', color: '#007600', marginBottom: 2 }}>
                                                {order.status === 'Pending' ? '🚚 Arriving Soon' : order.status}
                                            </h3>
                                            <div style={{ fontSize: 13, color: '#565959' }}>
                                                {totalItems} {totalItems === 1 ? 'item' : 'items'} shipped
                                            </div>
                                        </div>
                                        {order.items && order.items.length > 0 && (
                                            <button
                                                className="btn btn-primary"
                                                style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 20 }}
                                                onClick={() => handleBuyAgain(order.items)}
                                            >
                                                Buy it again
                                            </button>
                                        )}
                                    </div>

                                    {isExpanded && order.items && order.items.map(item => (
                                        <div key={item.id} style={{ display: 'flex', gap: '20px', marginBottom: '16px', paddingTop: '12px', borderTop: '1px solid #f5f5f5' }}>
                                            <img
                                                src={item.image_url}
                                                alt={item.name || 'Product'}
                                                style={{ width: '90px', height: '90px', objectFit: 'contain', background: '#f8f8f8', borderRadius: 4, flexShrink: 0 }}
                                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=100'}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <Link
                                                    to={`/product/${item.product_id}`}
                                                    style={{ color: '#007185', fontWeight: 500, fontSize: '1rem', textDecoration: 'none' }}
                                                >
                                                    {item.name || 'Product no longer available'}
                                                </Link>
                                                <div style={{ fontSize: '0.85rem', color: '#565959', marginTop: '4px' }}>
                                                    Qty: {item.quantity} &nbsp;·&nbsp;
                                                    ₹{parseFloat(item.price_at_purchase).toLocaleString('en-IN', { minimumFractionDigits: 2 })} each
                                                </div>
                                                <div style={{ fontSize: 13, color: '#565959', marginTop: 2 }}>Sold by: Amazon Clone</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;

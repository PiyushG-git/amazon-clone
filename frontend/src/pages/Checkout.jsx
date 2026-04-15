import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const { cart, cartTotal, fetchCart } = useCart();
    const { api, user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const isBuyNow = searchParams.get('buyNow') === 'true';
    const directProductId = searchParams.get('productId');
    const directQty = parseInt(searchParams.get('qty')) || 1;

    const [directProduct, setDirectProduct] = useState(null);
    const [address, setAddress] = useState('Flat 101, Main Block, MG Road, Bengaluru, Karnataka 560001, India');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!user) {
        navigate('/auth');
    }

    useEffect(() => {
        if (isBuyNow && directProductId) {
            axios.get(`http://localhost:5000/api/products/${directProductId}`)
                .then(res => setDirectProduct(res.data))
                .catch(err => { console.error(err); setError('Could not load product.'); });
        }
    }, [isBuyNow, directProductId]);

    const activeItems = isBuyNow
        ? (directProduct ? [{ ...directProduct, quantity: directQty, cart_item_id: 'direct' }] : [])
        : cart;

    const activeTotal = isBuyNow
        ? (directProduct ? parseFloat(directProduct.price) * directQty : 0)
        : cartTotal;

    if (!isBuyNow && cart.length === 0) {
        return (
            <div className="container" style={{ padding: '40px', fontSize: '18px', textAlign: 'center' }}>
                <p>Your cart is empty.</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
                    Start Shopping
                </button>
            </div>
        );
    }

    if (isBuyNow && !directProduct) {
        return <div className="container" style={{ padding: '40px' }}>Loading checkout details...</div>;
    }

    const placeOrder = async () => {
        if (!address.trim() || address.trim().length < 10) {
            setError('Please enter a valid shipping address (at least 10 characters).');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const payload = {
                shipping_address: address,
                ...(isBuyNow && { direct_product_id: directProductId, direct_quantity: directQty })
            };
            const res = await api.post('/orders', payload);
            const orderId = res.data.order_id;
            if (!isBuyNow) await fetchCart();
            navigate(`/order-confirmation/${orderId}`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh', padding: '20px 0' }}>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '0 20px' }}>

                {/* Left Column */}
                <div style={{ flex: '1 1 580px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '20px' }}>Checkout</h1>

                    {error && (
                        <div style={{ background: '#fff8f0', border: '1px solid #e77600', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 14, color: '#c45500' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Step 1: Shipping */}
                    <div className="checkout-step">
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="checkout-step-num">1</div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Shipping address</h2>
                                <textarea
                                    value={address}
                                    onChange={e => { setAddress(e.target.value); setError(''); }}
                                    rows={3}
                                    style={{
                                        width: '100%', padding: '10px',
                                        borderRadius: '4px',
                                        border: error && address.trim().length < 10 ? '1px solid #c45500' : '1px solid #888C8C',
                                        resize: 'vertical', fontSize: '14px', fontFamily: 'inherit'
                                    }}
                                    placeholder="Enter your full shipping address"
                                />
                                <div style={{ fontSize: '13px', color: '#007185', marginTop: '8px', cursor: 'pointer' }}>
                                    + Add a new address
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Payment */}
                    <div className="checkout-step">
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="checkout-step-num">2</div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Payment method</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { id: 'credit_card', label: 'Credit or Debit Card', icon: '💳' },
                                        { id: 'upi', label: 'UPI / Net Banking', icon: '📱' },
                                        { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                                    ].map(opt => (
                                        <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', border: paymentMethod === opt.id ? '2px solid #e47911' : '1px solid #ddd', borderRadius: 8, background: paymentMethod === opt.id ? '#fffbf5' : 'white' }}>
                                            <input type="radio" name="payment" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} />
                                            <span>{opt.icon}</span>
                                            <span style={{ fontWeight: paymentMethod === opt.id ? 600 : 400 }}>{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Review */}
                    <div className="checkout-step">
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="checkout-step-num">3</div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Review items and delivery</h2>
                                <div style={{ border: '1px solid #D5D9D9', borderRadius: '8px', padding: '15px', background: '#fafafa' }}>
                                    <div style={{ color: '#007600', fontWeight: 'bold', marginBottom: '8px', fontSize: 14 }}>
                                        🚚 Estimated Delivery: Tomorrow
                                    </div>
                                    {activeItems.map(item => (
                                        <div key={item.cart_item_id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', paddingTop: '10px' }}>
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                style={{ width: '70px', height: '70px', objectFit: 'contain', background: 'white', borderRadius: 4 }}
                                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=100'}
                                            />
                                            <div>
                                                <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.name}</div>
                                                <div style={{ color: '#B12704', fontWeight: '700', fontSize: '16px', margin: '5px 0' }}>
                                                    ₹{parseFloat(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#565959' }}>Qty: {item.quantity}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div style={{ flex: '0 0 300px' }}>
                    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', position: 'sticky', top: '20px' }}>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '12px', fontSize: '15px', borderRadius: '8px', marginBottom: '10px' }}
                            onClick={placeOrder}
                            disabled={loading}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid #0f1111', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
                                    Processing…
                                </span>
                            ) : 'Place your order'}
                        </button>

                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                        <div style={{ fontSize: '11px', color: '#565959', textAlign: 'center', marginBottom: '15px' }}>
                            By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
                        </div>

                        <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '15px 0' }} />
                        <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Order Summary</h3>

                        <div style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Items ({activeItems.reduce((a, i) => a + i.quantity, 0)}):</span>
                                <span>₹{activeTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Delivery:</span>
                                <span style={{ color: '#007600', fontWeight: 600 }}>FREE</span>
                            </div>
                        </div>

                        <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '12px 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#B12704' }}>
                            <span>Order Total:</span>
                            <span>₹{activeTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;

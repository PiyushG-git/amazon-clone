import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (id, newQty) => {
        if (newQty < 1) return;
        updateQuantity(id, newQty);
    };

    if (cart.length === 0) {
        return (
            <div className="container">
                <div className="empty-cart-container">
                    <ShoppingBag size={80} className="empty-cart-icon" />
                    <h2>Your Amazon Cart is empty</h2>
                    <p>Your shopping cart lives to serve. Give it purpose — fill it with electronics, books, beauty, and more.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')} style={{ padding: '12px 30px', fontSize: '1rem' }}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            {/* Left Column: Items */}
            <div className="cart-left-col">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <span style={{ fontSize: '14px', color: '#565959', float: 'right' }}>Price</span>
                </div>
                
                {cart.map(item => (
                    <div className="cart-item-modern" key={item.cart_item_id}>
                        <div className="cart-item-img-wrapper">
                            <img src={item.image_url} alt={item.name} />
                        </div>
                        
                        <div className="cart-item-details">
                            <Link to={`/product/${item.id}`} className="cart-item-title">
                                {item.name}
                            </Link>
                            <div className="cart-item-stock">In Stock</div>
                            <div style={{ fontSize: '12px', color: '#565959' }}>Eligible for FREE Shipping</div>
                            
                            <div className="cart-item-actions">
                                <div className="qty-selector-modern">
                                    <button 
                                        className="qty-btn" 
                                        onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button 
                                        className="qty-btn" 
                                        onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <div style={{ width: '1px', height: '20px', background: '#D5D9D9' }}></div>
                                <span className="action-link" onClick={() => removeFromCart(item.cart_item_id)}>Delete</span>
                                <div style={{ width: '1px', height: '20px', background: '#D5D9D9' }}></div>
                                <span className="action-link">Save for later</span>
                            </div>
                        </div>

                        <div className="cart-item-price-row">
                            <span className="cart-item-price">₹{parseFloat(item.price).toFixed(2)}</span>
                        </div>
                    </div>
                ))}

                <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '18px' }}>
                    Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items): 
                    <span style={{ fontWeight: '700', marginLeft: '5px' }}>₹{cartTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Right Column: Summary Sidebar */}
            <div className="cart-right-col">
                <div className="cart-summary-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#007600', fontSize: '14px', marginBottom: '16px' }}>
                        <div style={{ background: '#007600', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                        Your order is eligible for FREE Delivery.
                    </div>
                    
                    <h3 className="cart-summary-title">
                        Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items): 
                        <span style={{ fontWeight: '700', display: 'block', fontSize: '22px', marginTop: '4px' }}>₹{cartTotal.toFixed(2)}</span>
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                            <input type="checkbox" /> This order contains a gift
                        </label>
                    </div>

                    <button 
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '15px' }} 
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                    </button>
                </div>

                <div className="cart-summary-card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Your recently viewed items</span>
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

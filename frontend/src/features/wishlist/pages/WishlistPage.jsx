import React from 'react';
import { Link } from 'react-router-dom';
import useWishlist from '../hooks/useWishlist';
import useCart from '../../cart/hooks/useCart';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div className="container" style={{padding: '2rem'}}>
            <h2>Your Wishlist</h2>
            {wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px'}}>
                    {wishlist.map(item => (
                        <div className="list-item" key={item.wishlist_id}>
                            <Link to={`/product/${item.product_id}`}>
                                <img src={item.image_url} alt={item.name} className="list-item-img" />
                            </Link>
                            <div className="list-item-info">
                                <Link to={`/product/${item.product_id}`} className="list-item-title">
                                    {item.name}
                                </Link>
                                <div className="list-item-price" style={{marginBottom: '15px'}}>
                                    ₹{parseFloat(item.price).toFixed(2)}
                                </div>
                                <div style={{display: 'flex', gap: '10px'}}>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={() => addToCart(item.product_id)}
                                        style={{borderRadius: '20px', padding: '5px 15px'}}
                                    >
                                        Add to Cart
                                    </button>
                                    <button 
                                        className="btn"
                                        style={{background: '#f0f2f2', border: '1px solid #d5d9d9', color: '#0f1111', borderRadius: '20px', padding: '5px 15px'}}
                                        onClick={() => removeFromWishlist(item.wishlist_id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;

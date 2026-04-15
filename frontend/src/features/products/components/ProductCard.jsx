import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../cart/hooks/useCart';
import useWishlist from '../../wishlist/hooks/useWishlist';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);
    const priceVal = parseFloat(product.price) || 0;

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-img"
                    loading="lazy"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=300'}
                />
            </Link>
            <div className="product-info">
                <Link to={`/product/${product.id}`} className="product-title" title={product.name}>
                    {product.name}
                </Link>

                <StarRating rating={product.rating} count={product.rating_count} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <div className="product-price">
                        <span className="currency-sym">₹</span>
                        {priceVal.toLocaleString('en-IN')}
                    </div>
                    <button
                        className="wishlist-btn"
                        style={{ color: isWishlisted ? '#e31c3d' : '#aaa' }}
                        onClick={() => addToWishlist(product.id)}
                        disabled={isWishlisted}
                        title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                        aria-label={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                    >
                        {isWishlisted ? '♥' : '♡'}
                    </button>
                </div>

                <div style={{ fontSize: '12px', color: '#007600', marginBottom: '8px' }}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>

                <div className="product-actions">
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', borderRadius: 20 }}
                        onClick={() => addToCart(product.id)}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useProductDetail from '../hooks/useProductDetail';
import useCart from '../../cart/hooks/useCart';
import useWishlist from '../../wishlist/hooks/useWishlist';
import StarRating from '../components/StarRating';

// Generate pseudo-carousel images from the base unsplash URL
const generateCarouselImages = (baseUrl, count = 5) => {
    if (!baseUrl) return [];
    const widths = [800, 600, 400, 700, 500];
    return widths.slice(0, count).map((w, i) => {
        return baseUrl.replace(/w=\d+/, `w=${w}`);
    });
};

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { product, loading } = useProductDetail(id);
    const [qty, setQty] = useState(1);
    const [activeImg, setActiveImg] = useState(0);
    
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();

    if (loading) return (
        <div style={{ background: 'white', padding: '40px 20px', maxWidth: 1500, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 20 }}>
                <div className="skeleton" style={{ width: '40%', height: 400, borderRadius: 8 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="skeleton skeleton-text" style={{ width: '80%', height: 28 }} />
                    <div className="skeleton skeleton-text" style={{ width: '30%', height: 20 }} />
                    <div className="skeleton skeleton-text" style={{ width: '20%', height: 36 }} />
                    <div className="skeleton skeleton-text" style={{ width: '60%', height: 16 }} />
                    <div className="skeleton skeleton-text" style={{ width: '60%', height: 16 }} />
                    <div className="skeleton skeleton-text" style={{ width: '50%', height: 16 }} />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div style={{ padding: '60px', textAlign: 'center', background: 'white' }}>
            <h2>Product not found</h2>
            <Link to="/" style={{ marginTop: 12, display: 'inline-block' }}>← Back to Home</Link>
        </div>
    );

    const isWishlisted = isInWishlist(product.id);
    const priceVal = parseFloat(product.price) || 0;
    const parts = priceVal.toLocaleString('en-IN').split('.');
    const carouselImages = generateCarouselImages(product.image_url, 5);

    const handleAddToCart = () => addToCart(product.id, qty);
    const handleWishlist = () => { if (!isWishlisted) addToWishlist(product.id); };

    return (
        <div style={{ background: 'white' }}>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid #ddd', fontSize: '13px', color: '#565959', maxWidth: '1500px', margin: '0 auto' }}>
                <Link to="/" style={{ color: '#007185', textDecoration: 'none' }}>Home</Link>
                {' › '}
                <Link to={`/search?category=${product.category}`} style={{ color: '#007185', textDecoration: 'none' }}>{product.category}</Link>
                {' › '}
                <span style={{ fontWeight: '600', color: '#0f1111' }}>{product.name.substring(0, 40)}{product.name.length > 40 ? '…' : ''}</span>
            </div>

            <div className="detail-layout">
                <div className="detail-image-col">
                    <div className="carousel-container">
                        <img
                            key={activeImg}
                            src={carouselImages[activeImg] || product.image_url}
                            alt={product.name}
                            className="carousel-main-img"
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800'}
                        />
                        <div className="carousel-thumbnails">
                            {carouselImages.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`View ${idx + 1}`}
                                    className={`carousel-thumb ${activeImg === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImg(idx)}
                                    onError={(e) => e.target.src = product.image_url}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="detail-info-col">
                    <h1>{product.name}</h1>
                    <div style={{ fontSize: '14px', color: '#007185', marginBottom: 4 }}>
                        Visit the <span style={{ fontWeight: 600 }}>Amazon Clone</span> Store
                    </div>

                    <div className="detail-rating-row">
                        <span className="detail-rating-number">{parseFloat(product.rating || 0).toFixed(1)}</span>
                        <StarRating rating={product.rating} count={product.rating_count} size="md" />
                    </div>

                    <hr style={{ margin: '10px 0', borderColor: '#eee' }} />

                    <div style={{ margin: '15px 0' }}>
                        <span style={{ fontSize: '14px', position: 'relative', top: '-0.5em', color: '#0f1111' }}>₹</span>
                        <span style={{ fontSize: '32px', fontWeight: 400, color: '#0f1111' }}>{parts[0]}</span>
                        {parts[1] && <span style={{ fontSize: '14px', position: 'relative', top: '-0.5em', color: '#0f1111' }}>.{parts[1]}</span>}
                    </div>

                    <div style={{ fontSize: 13, color: '#565959', marginBottom: 10 }}>
                        Inclusive of all taxes &nbsp;|&nbsp;
                        <span style={{ color: '#007185' }}>FREE delivery on orders above ₹499</span>
                    </div>

                    <table style={{ fontSize: '14px', width: '260px', marginBottom: '20px' }}>
                        <tbody>
                            <tr><td style={{ fontWeight: 'bold', paddingBottom: '6px', paddingRight: 16 }}>Brand</td><td>Amazon Clone</td></tr>
                            <tr><td style={{ fontWeight: 'bold', paddingBottom: '6px', paddingRight: 16 }}>Category</td><td>{product.category}</td></tr>
                            <tr><td style={{ fontWeight: 'bold', paddingBottom: '6px', paddingRight: 16 }}>Availability</td>
                                <td style={{ color: product.stock > 0 ? '#007600' : '#c45500', fontWeight: 600 }}>
                                    {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <hr style={{ margin: '10px 0', borderColor: '#eee' }} />

                    <h3 style={{ fontSize: '16px', marginTop: '10px', marginBottom: 8 }}>About this item</h3>
                    <ul className="bullet-list">
                        <li>{product.description}</li>
                        <li>High quality authentic materials used in crafting this premium item.</li>
                        <li>Ensures durability and long-lasting usage in varied environments.</li>
                        <li>Perfect for daily use or to give as an elegant gift.</li>
                    </ul>
                </div>

                <div className="detail-buy-col">
                    <div className="buy-box">
                        <div style={{ fontSize: '20px', fontWeight: '500', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', position: 'relative', top: '-0.3em' }}>₹</span>
                            {parts[0]}
                            {parts[1] && <span style={{ fontSize: '12px', position: 'relative', top: '-0.3em' }}>.{parts[1]}</span>}
                        </div>

                        <div style={{ fontSize: '13px', color: '#007185', marginBottom: '8px' }}>
                            FREE delivery <strong style={{ color: '#0f1111' }}>Tomorrow</strong>
                        </div>
                        <div style={{ fontSize: '13px', color: '#007185', marginBottom: '16px' }}>
                            📍 Deliver to India
                        </div>

                        <div style={{ color: product.stock > 0 ? '#007600' : '#c45500', fontSize: '18px', marginBottom: '14px', fontWeight: '400' }}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </div>

                        {product.stock > 0 && (
                            <>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Quantity:</label>
                                    <select
                                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #d5d9d9', outline: 'none', background: '#f0f2f2', fontSize: 14, cursor: 'pointer' }}
                                        value={qty}
                                        onChange={e => setQty(Number(e.target.value))}
                                    >
                                        {[...Array(Math.min(10, product.stock)).keys()].map(x => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginBottom: '10px', borderRadius: '20px', padding: '9px 0' }}
                                    onClick={handleAddToCart}
                                >
                                    Add to cart
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    style={{ width: '100%', borderRadius: '20px', marginBottom: '16px', padding: '9px 0' }}
                                    onClick={() => navigate(`/checkout?buyNow=true&productId=${product.id}&qty=${qty}`)}
                                >
                                    Buy Now
                                </button>

                                <div style={{ fontSize: '12px', color: '#565959', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>Ships from</span><span>Amazon Clone</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#565959', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>Sold by</span><span style={{ color: '#007185' }}>Third Party</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#007185', marginBottom: '16px' }}>🔒 Secure transaction</div>

                                <hr style={{ margin: '12px 0', borderColor: '#eee' }} />

                                <button
                                    style={{
                                        width: '100%', background: isWishlisted ? '#f5f5f5' : '#f0f2f2',
                                        border: '1px solid #d5d9d9', padding: '8px', borderRadius: '4px',
                                        cursor: isWishlisted ? 'default' : 'pointer', fontSize: '13px',
                                        color: isWishlisted ? '#007600' : '#0f1111'
                                    }}
                                    onClick={handleWishlist}
                                    disabled={isWishlisted}
                                >
                                    {isWishlisted ? '✓ Added to Wishlist' : '♡ Add to Wishlist'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

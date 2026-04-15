import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { StarRating } from '../components/ProductCard';

const PRICE_RANGES = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 – ₹2,000', min: 500, max: 2000 },
    { label: '₹2,000 – ₹10,000', min: 2000, max: 10000 },
    { label: '₹10,000 – ₹50,000', min: 10000, max: 50000 },
    { label: 'Over ₹50,000', min: 50000, max: 9999999 },
];

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Kitchen', 'Books', 'Toys', 'Sports', 'Beauty', 'Automotive'];

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('newest');
    const [priceRange, setPriceRange] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const searchQ = queryParams.get('q') || '';
    const categoryQ = queryParams.get('category') || '';

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            let url = `http://localhost:5000/api/products?sort=${sort}`;
            if (searchQ) url += `&search=${encodeURIComponent(searchQ)}`;
            if (categoryQ) url += `&category=${encodeURIComponent(categoryQ)}`;
            if (priceRange) {
                url += `&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`;
            }
            const res = await axios.get(url);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [location.search, sort, priceRange]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleCategoryClick = (cat) => {
        const params = new URLSearchParams(location.search);
        if (cat === categoryQ) {
            params.delete('category');
        } else {
            params.set('category', cat);
        }
        navigate(`/search?${params.toString()}`);
    };

    const handlePriceRange = (range) => {
        setPriceRange(prev => prev === range ? null : range);
    };

    const pageTitle = searchQ
        ? `Results for "${searchQ}"`
        : categoryQ
            ? `${categoryQ} Products`
            : 'All Products';

    return (
        <div className="search-layout">
            {/* Sidebar Filters */}
            <aside className="sidebar-filters">
                <h3>Filters</h3>

                {/* Category filter */}
                <div className="filter-section">
                    <h4>Department</h4>
                    <ul>
                        {CATEGORIES.map(cat => (
                            <li
                                key={cat}
                                className={categoryQ === cat ? 'active' : ''}
                                onClick={() => handleCategoryClick(cat)}
                            >
                                {categoryQ === cat ? '▶ ' : ''}{cat}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price filter */}
                <div className="filter-section">
                    <h4>Price</h4>
                    <ul>
                        {PRICE_RANGES.map(range => (
                            <li
                                key={range.label}
                                className={priceRange === range ? 'active' : ''}
                                onClick={() => handlePriceRange(range)}
                            >
                                <input
                                    type="checkbox"
                                    readOnly
                                    checked={priceRange === range}
                                    style={{ pointerEvents: 'none' }}
                                />
                                {range.label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customer Reviews */}
                <div className="filter-section">
                    <h4>Customer Reviews</h4>
                    <ul>
                        {[4, 3].map(stars => (
                            <li key={stars}>
                                <span style={{ color: '#ffa41c', fontSize: 14 }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                                <span style={{ fontSize: 12, marginLeft: 4 }}>& Up</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Clear filters */}
                {(categoryQ || priceRange) && (
                    <button
                        onClick={() => { setPriceRange(null); navigate('/search' + (searchQ ? `?q=${searchQ}` : '')); }}
                        style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: 13, padding: 0, textDecoration: 'underline', marginTop: 8 }}
                    >
                        Clear all filters
                    </button>
                )}
            </aside>

            {/* Results */}
            <main className="search-results">
                <div className="search-results-header">
                    <div>
                        {loading
                            ? <span style={{ color: '#565959' }}>Searching…</span>
                            : <span>
                                <span style={{ color: '#565959' }}>
                                    {products.length === 0 ? 'No results' : `1–${products.length} of ${products.length} results`}
                                </span>
                                {' '}for <strong>"{pageTitle}"</strong>
                              </span>
                        }
                    </div>
                    <select
                        className="sort-select"
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                    >
                        <option value="newest">Sort by: Featured</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Avg. Customer Review</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{ display: 'flex', gap: 20, padding: '16px 0', borderBottom: '1px solid #eee' }}>
                                <div className="skeleton" style={{ width: 180, height: 180, flexShrink: 0, borderRadius: 8 }} />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div className="skeleton skeleton-text" style={{ width: '80%', height: 18 }} />
                                    <div className="skeleton skeleton-text" style={{ width: '30%', height: 14 }} />
                                    <div className="skeleton skeleton-text" style={{ width: '20%', height: 28 }} />
                                    <div className="skeleton skeleton-text" style={{ width: '15%', height: 36, marginTop: 'auto', borderRadius: 20 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="no-results">
                        <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
                        <h3>No results found</h3>
                        <p>Try adjusting your search or removing filters.</p>
                        <button className="btn btn-primary" style={{ marginTop: 20, borderRadius: 8, padding: '10px 24px' }} onClick={() => navigate('/')}>
                            Back to Home
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {products.map(p => {
                            const priceVal = parseFloat(p.price) || 0;
                            const parts = priceVal.toLocaleString('en-IN', { minimumFractionDigits: 2 }).split('.');
                            return (
                                <div className="list-item" key={p.id}>
                                    <Link to={`/product/${p.id}`}>
                                        <img
                                            src={p.image_url}
                                            alt={p.name}
                                            className="list-item-img"
                                            loading="lazy"
                                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=200'}
                                        />
                                    </Link>
                                    <div className="list-item-info">
                                        <Link to={`/product/${p.id}`} className="list-item-title">{p.name}</Link>

                                        <StarRating rating={p.rating} count={p.rating_count} />

                                        <p style={{ fontSize: '14px', color: '#565959', margin: '4px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {p.description}
                                        </p>

                                        <div className="list-item-price">
                                            <span className="currency-sm">₹</span>
                                            {parts[0]}
                                            {parts[1] && <span className="cents-sm">.{parts[1]}</span>}
                                        </div>

                                        <div style={{ fontSize: '13px', color: '#565959', marginBottom: '12px' }}>
                                            Get it by <strong>Tomorrow</strong> — FREE Delivery
                                        </div>

                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => addToCart(p.id)}
                                                style={{ padding: '6px 18px', borderRadius: '20px' }}
                                                disabled={p.stock === 0}
                                            >
                                                {p.stock === 0 ? 'Out of Stock' : 'Add to cart'}
                                            </button>
                                            <Link to={`/product/${p.id}`}>
                                                <button className="btn" style={{ padding: '6px 18px', borderRadius: '20px', background: '#f0f2f2', border: '1px solid #d5d9d9' }}>
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchPage;

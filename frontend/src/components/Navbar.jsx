import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, Menu, User, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const navigate = useNavigate();
    const location = useLocation();
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    const isCheckout = location.pathname === '/checkout';
    const cartCount = (cart || []).reduce((acc, item) => acc + item.quantity, 0);

    // Fetch suggestions with 300ms debounce
    const fetchSuggestions = useCallback((q) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!q || q.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            try {
                const params = new URLSearchParams({ q: q.trim() });
                if (category && category !== 'All') params.append('category', category);
                const res = await axios.get(`http://localhost:5000/api/products/suggestions?${params}`);
                setSuggestions(res.data);
                setShowSuggestions(res.data.length > 0);
                setActiveIdx(-1);
            } catch (err) { /* silent */ }
        }, 300);
    }, [category]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        fetchSuggestions(val);
    };

    const handleSearch = (e) => {
        e?.preventDefault();
        setShowSuggestions(false);
        let url = '/search?';
        if (search.trim()) url += `q=${encodeURIComponent(search.trim())}&`;
        if (category && category !== 'All') url += `category=${encodeURIComponent(category)}`;
        navigate(url.endsWith('?') || url.endsWith('&') ? url.slice(0, -1) : url);
    };

    const handleSuggestionClick = (item) => {
        setSearch(item.name);
        setShowSuggestions(false);
        navigate(`/product/${item.id}`);
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions) return;
        if (e.key === 'ArrowDown') {
            setActiveIdx(prev => Math.min(prev + 1, suggestions.length - 1));
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            setActiveIdx(prev => Math.max(prev - 1, -1));
            e.preventDefault();
        } else if (e.key === 'Enter' && activeIdx >= 0) {
            handleSuggestionClick(suggestions[activeIdx]);
            e.preventDefault();
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header>
            {/* Primary Navbar */}
            <nav className="navbar">
                <Link to="/" className="nav-logo">amazon</Link>

                {!isCheckout && (
                    <>
                        {/* Location */}
                        <div className="nav-item" style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="nav-item-top" style={{ marginLeft: 22 }}>Deliver to</span>
                                <div style={{ display: 'flex', alignItems: 'center' }} className="nav-item-bottom">
                                    <MapPin size={18} style={{ marginLeft: -3 }} /> India
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="nav-search-wrapper" ref={wrapperRef}>
                            <form className="nav-search" onSubmit={handleSearch}>
                                <select
                                    className="nav-search-select"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    <option value="All">All</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Home">Home</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Books">Books</option>
                                    <option value="Toys">Toys</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Beauty">Beauty</option>
                                    <option value="Automotive">Automotive</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search Amazon"
                                    value={search}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                    autoComplete="off"
                                />
                                <button type="submit" className="nav-search-btn" aria-label="Search">
                                    <Search color="#131921" size={24} />
                                </button>
                            </form>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (
                                <div className="search-suggestions">
                                    {suggestions.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className={`suggestion-item ${activeIdx === idx ? 'active' : ''}`}
                                            onMouseDown={() => handleSuggestionClick(item)}
                                        >
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=50'}
                                            />
                                            <div className="suggestion-item-text">
                                                <div className="suggestion-item-name">{item.name}</div>
                                                <div className="suggestion-item-cat">in {item.category}</div>
                                            </div>
                                            <div className="suggestion-item-price">
                                                ₹{parseFloat(item.price).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Right Nav Links */}
                <div className="nav-links">
                    {/* Language */}
                    <div className="nav-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '5px', paddingTop: '15px' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" style={{ width: '20px' }} alt="EN" />
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'white' }}>EN</span>
                    </div>

                    {/* Account Dropdown */}
                    <div className="nav-item">
                        <span className="nav-item-top">Hello, {user ? user.name.split(' ')[0] : 'sign in'}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }} className="nav-item-bottom">
                            Account & Lists <ChevronDown size={14} style={{ marginLeft: '2px', color: '#ccc' }} />
                        </div>

                        <div className="nav-dropdown">
                            <div className="dropdown-header-row">
                                <div className="dropdown-user-info">
                                    <div className="dropdown-user-icon">
                                        <User size={24} color="#555" />
                                    </div>
                                    <span className="dropdown-user-name">{user ? user.name : 'Guest'}</span>
                                </div>
                                <div className="dropdown-actions">
                                    <span className="dropdown-action-link">Switch Accounts</span>
                                    {user ? (
                                        <span className="dropdown-action-link" onClick={logout}>Sign Out</span>
                                    ) : (
                                        <Link to="/auth" className="dropdown-action-link">Sign In</Link>
                                    )}
                                </div>
                            </div>
                            <div className="dropdown-columns">
                                <div className="dropdown-col">
                                    <h4>Your Lists</h4>
                                    <ul>
                                        <li><Link to="/wishlist">Your Wishlist</Link></li>
                                        <li><Link to="#">Create a List</Link></li>
                                        <li><Link to="#">Find a List or Registry</Link></li>
                                    </ul>
                                </div>
                                <div className="dropdown-col">
                                    <h4>Your Account</h4>
                                    <ul>
                                        <li><Link to="/orders">Orders</Link></li>
                                        <li><Link to="/wishlist">Wishlist</Link></li>
                                        <li><Link to="/auth">Account Settings</Link></li>
                                        <li><Link to="#">Browsing History</Link></li>
                                        <li><Link to="#">Shopping Preferences</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Returns & Orders */}
                    <Link to="/orders" className="nav-item">
                        <span className="nav-item-top">Returns</span>
                        <span className="nav-item-bottom">& Orders</span>
                    </Link>

                    {/* Cart */}
                    <Link to="/cart" className="nav-cart">
                        <div style={{ position: 'relative' }}>
                            <ShoppingCart size={38} strokeWidth={1.5} />
                            <span style={{
                                position: 'absolute', top: '-2px', left: '16px',
                                color: '#f08804', fontWeight: 'bold', fontSize: '15px'
                            }}>
                                {cartCount || 0}
                            </span>
                        </div>
                        <span>Cart</span>
                    </Link>
                </div>
            </nav>

            {/* Secondary Navbar */}
            {!isCheckout && (
                <div className="navbar-sub">
                    <div className="nav-sub-item menu-all"><Menu size={20} /> All</div>
                    <Link to="/search" className="nav-sub-item">Today's Deals</Link>
                    <Link to="/search?category=Electronics" className="nav-sub-item">Electronics</Link>
                    <Link to="/search?category=Fashion" className="nav-sub-item">Fashion</Link>
                    <Link to="/search?category=Home" className="nav-sub-item">Home & Kitchen</Link>
                    <Link to="/search?category=Books" className="nav-sub-item">Books</Link>
                    <Link to="/search?category=Sports" className="nav-sub-item">Sports</Link>
                    <Link to="/search?category=Beauty" className="nav-sub-item">Beauty</Link>
                    <div className="nav-sub-item">Customer Service</div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

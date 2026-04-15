import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, Menu, User, ChevronDown } from 'lucide-react';
import useCart from '../features/cart/hooks/useCart';
import useAuth from '../features/auth/hooks/useAuth';
import productService from '../features/products/services/product.service';

const Navbar = () => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [modalView, setModalView] = useState('list'); // 'list' or 'add'
    const [addresses, setAddresses] = useState([
        { id: 1, name: 'Piyush Gupta', street: 'B 204 clubhouse Phipla, ensaara metre park', city: 'NAGPUR', state: 'MAHARASHTRA', pincode: '440034', isDefault: true }
    ]);
    const [locationData, setLocationData] = useState({ name: 'Piyush', region: 'Nagpur 440034' });
    const [pincode, setPincode] = useState('');

    // Add Address Form State
    const [newName, setNewName] = useState('');
    const [newStreet, setNewStreet] = useState('');
    const [newCity, setNewCity] = useState('');
    const [newPincode, setNewPincode] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    const isCheckout = location.pathname === '/checkout';

    const fetchSuggestions = useCallback((q) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!q || q.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            try {
                const results = await productService.getSuggestions(q.trim());
                setSuggestions(results);
                setShowSuggestions(results.length > 0);
                setActiveIdx(-1);
            } catch (err) { /* silent */ }
        }, 300);
    }, []);

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleApplyPincode = (e) => {
        e.preventDefault();
        if (pincode.length === 6) {
            setLocationData({ name: 'Piyush', region: `Nagpur ${pincode}` });
            setShowAddressModal(false);
        }
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        if(!newName || !newStreet || !newCity || !newPincode) return;
        
        const newAddr = {
            id: Date.now(),
            name: newName,
            street: newStreet,
            city: newCity,
            state: '',
            pincode: newPincode,
            isDefault: false
        };
        setAddresses([...addresses, newAddr]);
        setModalView('list');
        // Reset form
        setNewName(''); setNewStreet(''); setNewCity(''); setNewPincode('');
    };

    const selectAddress = (addr) => {
        setLocationData({ name: addr.name.split(' ')[0], region: `${addr.city} ${addr.pincode}` });
        setShowAddressModal(false);
    };

    return (
        <>
            <header>
            <nav className="navbar">

                <Link to="/" className="nav-logo-link">
                    <span className="nav-logo-base"></span>
                    <span className="nav-logo-locale">.in</span>
                </Link>

                {!isCheckout && (
                    <>
                        <div className="nav-item" style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }} onClick={() => setShowAddressModal(true)}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="nav-item-top" style={{ marginLeft: 22 }}>Deliver to {locationData.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center' }} className="nav-item-bottom">
                                    <MapPin size={18} style={{ marginLeft: -3 }} /> {locationData.region}
                                </div>
                            </div>
                        </div>

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

                <div className="nav-links">
                    <div className="nav-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '5px', paddingTop: '15px' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" style={{ width: '20px' }} alt="EN" />
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'white' }}>EN</span>
                    </div>

                    <div className="nav-item">
                        <span className="nav-item-top">Hello, {user ? user.name.split(' ')[0] : 'sign in'}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }} className="nav-item-bottom">
                            Account & Lists <ChevronDown size={14} style={{ marginLeft: '2px', color: '#ccc' }} />
                        </div>
                        <div className="nav-dropdown">
                            {user ? (
                                <>
                                    <div className="dropdown-profile-banner">
                                        <span>Who is shopping? Select a profile.</span>
                                        <Link to="/profiles" className="manage-profiles-link">
                                            Manage Profiles <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                                        </Link>
                                    </div>
                                    <div className="dropdown-columns">
                                        <div className="dropdown-col">
                                            <h4>Your Lists</h4>
                                            <ul>
                                                <li><Link to="/wishlist">Shopping List</Link></li>
                                                <li><Link to="/wishlist">Create a Wish List</Link></li>
                                                <li><Link to="/wishlist">Wish from Any Website</Link></li>
                                                <li><Link to="/wishlist">Baby Wishlist</Link></li>
                                                <li><Link to="/wishlist">Discover Your Style</Link></li>
                                                <li><Link to="/wishlist">Explore Showroom</Link></li>
                                            </ul>
                                        </div>
                                        <div className="dropdown-col">
                                            <h4>Your Account</h4>
                                            <ul>
                                                <li><Link to="/auth">Switch Accounts</Link></li>
                                                <li onClick={logout} style={{ cursor: 'pointer', fontSize: '13px', color: '#444' }}>Sign Out</li>
                                                <hr style={{ border: 'none', borderTop: '1px solid #f3f3f3', margin: '10px 0' }} />
                                                <li><Link to="/account">Your Account</Link></li>
                                                <li><Link to="/orders">Your Orders</Link></li>
                                                <li><Link to="/wishlist">Your Wish List</Link></li>
                                                <li><Link to="/recommendations">Your Recommendations</Link></li>
                                                <li><Link to="/alerts">Recalls and Product Safety Alerts</Link></li>
                                                <li><Link to="/prime">Your Prime Membership</Link></li>
                                                <li><Link to="/video">Your Prime Video</Link></li>
                                                <li><Link to="/subscribe">Your Subscribe & Save Items</Link></li>
                                                <li><Link to="/subscriptions">Memberships & Subscriptions</Link></li>
                                                <li><Link to="/seller">Your Seller Account</Link></li>
                                                <li><Link to="/content">Content Library</Link></li>
                                                <li><Link to="/devices">Devices</Link></li>
                                                <li><Link to="/business">Register for a free Business Account</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ padding: '15px 20px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                                        <Link to="/auth" className="dropdown-signin-btn">
                                            Sign in
                                        </Link>
                                        <div style={{ marginTop: '5px', fontSize: '11px', color: '#111' }}>
                                            New customer? <Link to="/auth" style={{ color: '#0066c0' }}>Start here.</Link>
                                        </div>
                                    </div>
                                    <div className="dropdown-columns" style={{ padding: '15px 0' }}>
                                        <div className="dropdown-col">
                                            <h4>Your Lists</h4>
                                            <ul>
                                                <li><Link to="/wishlist">Create a Wish List</Link></li>
                                                <li><Link to="/wishlist">Wish from Any Website</Link></li>
                                                <li><Link to="/wishlist">Baby Wishlist</Link></li>
                                                <li><Link to="/wishlist">Discover Your Style</Link></li>
                                                <li><Link to="/wishlist">Explore Showroom</Link></li>
                                            </ul>
                                        </div>
                                        <div className="dropdown-col">
                                            <h4>Your Account</h4>
                                            <ul>
                                                <li><Link to="/account">Your Account</Link></li>
                                                <li><Link to="/orders">Your Orders</Link></li>
                                                <li><Link to="/wishlist">Your Wish List</Link></li>
                                                <li><span style={{ fontSize: '13px', color: '#111' }}>Keep shopping for</span></li>
                                                <li><Link to="/recommendations" style={{ color: '#0066c0' }}>Your Recommendations</Link></li>
                                                <li><Link to="/prime">Your Prime Membership</Link></li>
                                                <li><Link to="/video">Your Prime Video</Link></li>
                                                <li><Link to="/subscribe">Your Subscribe & Save Items</Link></li>
                                                <li><Link to="/subscriptions">Memberships & Subscriptions</Link></li>
                                                <li><Link to="/seller">Your Seller Account</Link></li>
                                                <li><Link to="/content">Manage Your Content and Devices</Link></li>
                                                <li><Link to="/business">Register for a free Business Account</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <Link to="/orders" className="nav-item">
                        <span className="nav-item-top">Returns</span>
                        <span className="nav-item-bottom">& Orders</span>
                    </Link>

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
                </div>
            )}
        </header>

        {showAddressModal && (
            <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
                <div className="address-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>{modalView === 'list' ? 'Choose your location' : 'Enter a new address'}</h3>
                        <button className="modal-close" onClick={() => setShowAddressModal(false)}>&times;</button>
                    </div>
                    <div className="modal-body">
                        {modalView === 'list' ? (
                            <>
                                <p className="modal-subtext">Select a delivery location to see product availability and delivery options</p>
                                
                                <div className="address-list" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                                    {addresses.map(addr => (
                                        <div key={addr.id} className="address-card" onClick={() => selectAddress(addr)}>
                                            <h4>{addr.name}</h4>
                                            <p>{addr.street}, {addr.city} {addr.state} {addr.pincode}</p>
                                            {addr.isDefault && <span className="default-tag">Default address</span>}
                                        </div>
                                    ))}
                                </div>

                                <span className="modal-link" onClick={() => setModalView('add')} style={{ cursor: 'pointer' }}>
                                    Add an address or pick-up point
                                </span>

                                <div className="modal-divider">or enter an Indian pincode</div>

                                <form className="pincode-form" onSubmit={handleApplyPincode}>
                                    <input 
                                        type="text" 
                                        className="pincode-input" 
                                        placeholder="Enter pincode"
                                        value={pincode}
                                        onChange={e => setPincode(e.target.value)}
                                        maxLength={6}
                                    />
                                    <button type="submit" className="btn-apply">Apply</button>
                                </form>
                            </>
                        ) : (
                            <form className="address-form" onSubmit={handleAddAddress}>
                                <div className="form-group">
                                    <label>Full name</label>
                                    <input type="text" value={newName} onChange={e => setNewName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Street address</label>
                                    <input type="text" value={newStreet} onChange={e => setNewStreet(e.target.value)} placeholder="House No, Street, Area" required />
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" value={newCity} onChange={e => setNewCity(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input type="text" value={newPincode} onChange={e => setNewPincode(e.target.value)} maxLength={6} required />
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-back" onClick={() => setModalView('list')}>Back</button>
                                    <button type="submit" className="btn-add-submit">Add Address</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default Navbar;

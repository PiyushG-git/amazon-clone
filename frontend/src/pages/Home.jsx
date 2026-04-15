import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SkeletonCard = () => (
    <div className="amz-card skeleton-card">
        <div className="skeleton skeleton-img" style={{ height: 28, width: '60%', marginBottom: 12 }} />
        <div className="amz-card-grid">
            {[...Array(4)].map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="skeleton" style={{ height: 100, borderRadius: 4 }} />
                    <div className="skeleton skeleton-text short" />
                </div>
            ))}
        </div>
        <div className="skeleton skeleton-text short" style={{ width: '30%', marginTop: 8 }} />
    </div>
);

const ProductQuadCard = ({ title, products, linkTo, linkText, fallbackImg }) => (
    <div className="amz-card">
        <h2>{title}</h2>
        <div className="amz-card-grid">
            {products.map(p => (
                <Link to={`/product/${p.id}`} className="amz-quad-item" key={p.id}>
                    <img
                        src={p.image_url}
                        alt={p.name}
                        className="amz-quad-img"
                        loading="lazy"
                        onError={(e) => e.target.src = fallbackImg}
                    />
                    <span className="amz-quad-title">{p.name}</span>
                </Link>
            ))}
        </div>
        <Link to={linkTo} className="amz-card-link">{linkText}</Link>
    </div>
);

const FALLBACK = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=300';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const byCategory = (cat, count = 4) => products.filter(p => p.category === cat).slice(0, count);

    const techProducts    = byCategory('Electronics');
    const fashionProducts = byCategory('Fashion');
    const homeProducts    = byCategory('Home');
    const kitchenProducts = byCategory('Kitchen');
    const bookProducts    = byCategory('Books');
    const toyProducts     = byCategory('Toys');
    const sportsProducts  = byCategory('Sports');
    const beautyProducts  = byCategory('Beauty');

    const cards = [
        { title: 'Gifts for techie Mom', products: techProducts,    linkTo: '/search?category=Electronics', linkText: 'Explore Electronics' },
        { title: 'New home arrivals',    products: homeProducts,     linkTo: '/search?category=Home',        linkText: 'Shop Home & Decor' },
        { title: 'Top categories in Kitchen', products: kitchenProducts, linkTo: '/search?category=Kitchen', linkText: 'Explore all in Kitchen' },
        { title: 'Shop Fashion for less', products: fashionProducts, linkTo: '/search?category=Fashion',     linkText: 'See all deals' },
        { title: 'Top rated Books & Novels', products: bookProducts, linkTo: '/search?category=Books',      linkText: 'Shop popular books' },
        { title: 'Fun Toys for everyone', products: toyProducts,     linkTo: '/search?category=Toys',       linkText: 'Explore all toys' },
        { title: 'Level up your fitness', products: sportsProducts,  linkTo: '/search?category=Sports',     linkText: 'Gear up for sports' },
        { title: 'Beauty & Personal Care', products: beautyProducts, linkTo: '/search?category=Beauty',     linkText: 'Discover beauty products' },
    ];

    return (
        <div style={{ position: 'relative' }}>
            {/* Hero Banner */}
            <div className="hero-container">
                <img
                    className="hero-img"
                    src="https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg"
                    alt="Amazon Hero Banner"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1500'}
                />
            </div>

            {/* Cards Layer */}
            <div className="home-cards-layer">
                <div style={{ background: 'white', padding: '10px 20px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                    You are on Amazon Clone. Shop millions of products with fast local delivery.{' '}
                    <Link to="/search">Browse All Products →</Link>
                </div>

                <div className="grid-container">
                    {loading
                        ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
                        : cards.filter(c => c.products.length > 0).map((card, i) => {
                            // Every 3rd card (0-indexed: 2, 5, ...) show a banner-style card
                            if ((i === 2 || i === 5)) {
                                const banners = [
                                    { img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800', title: 'Get your game on', link: '/search?category=Electronics', cta: 'Shop gaming' },
                                    { img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800', title: 'Find gifts for Mom', link: '/search?category=Fashion', cta: "Shop Mother's Day gifts" },
                                ];
                                const b = banners[i === 2 ? 0 : 1];
                                return (
                                    <React.Fragment key={`frag-${i}`}>
                                        <div className="amz-card" key={`banner-${i}`}>
                                            <h2 style={{ marginBottom: '15px' }}>{b.title}</h2>
                                            <Link to={b.link} style={{ flex: 1, display: 'flex' }}>
                                                <img src={b.img} style={{ width: '100%', flex: 1, objectFit: 'cover', borderRadius: 4 }} alt={b.title} loading="lazy" />
                                            </Link>
                                            <Link to={b.link} className="amz-card-link" style={{ marginTop: 12 }}>{b.cta}</Link>
                                        </div>
                                        <ProductQuadCard key={card.title} {...card} fallbackImg={FALLBACK} />
                                    </React.Fragment>
                                );
                            }
                            return <ProductQuadCard key={card.title} {...card} fallbackImg={FALLBACK} />;
                        })
                    }
                </div>

                {/* Horizontal Bestsellers Strip */}
                <div className="h-strip">
                    <h2>Best Sellers across all departments</h2>
                    <div className="h-scroll">
                        {loading
                            ? [...Array(10)].map((_, i) => (
                                <div key={i} style={{ flexShrink: 0 }}>
                                    <div className="skeleton" style={{ width: 150, height: 180, borderRadius: 8 }} />
                                </div>
                            ))
                            : products.slice(0, 20).map(p => (
                                <Link to={`/product/${p.id}`} className="h-strip-item" key={`h-${p.id}`} title={p.name}>
                                    <img
                                        src={p.image_url}
                                        alt={p.name}
                                        loading="lazy"
                                        onError={(e) => e.target.src = FALLBACK}
                                    />
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

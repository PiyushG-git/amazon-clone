import React from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import SkeletonCard from '../components/SkeletonCard';
import ProductQuadCard from '../components/ProductQuadCard';

const FALLBACK = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=300';

const HomePage = () => {
    const { products, loading } = useProducts();

    const byCategory = (cat, count = 4) => products.filter(p => p.category === cat).slice(0, count);

    const cards = [
        { title: 'Gifts for techie Mom', products: byCategory('Electronics'),    linkTo: '/search?category=Electronics', linkText: 'Explore Electronics' },
        { title: 'New home arrivals',    products: byCategory('Home'),     linkTo: '/search?category=Home',        linkText: 'Shop Home & Decor' },
        { title: 'Top categories in Kitchen', products: byCategory('Kitchen'), linkTo: '/search?category=Kitchen', linkText: 'Explore all in Kitchen' },
        { title: 'Shop Fashion for less', products: byCategory('Fashion'), linkTo: '/search?category=Fashion',     linkText: 'See all deals' },
        { title: 'Top rated Books & Novels', products: byCategory('Books'), linkTo: '/search?category=Books',      linkText: 'Shop popular books' },
        { title: 'Fun Toys for everyone', products: byCategory('Toys'),     linkTo: '/search?category=Toys',       linkText: 'Explore all toys' },
        { title: 'Level up your fitness', products: byCategory('Sports'),  linkTo: '/search?category=Sports',     linkText: 'Gear up for sports' },
        { title: 'Beauty & Personal Care', products: byCategory('Beauty'), linkTo: '/search?category=Beauty',     linkText: 'Discover beauty products' },
    ];

    return (
        <div style={{ position: 'relative' }}>
            <div className="hero-container">
                <img
                    className="hero-img"
                    src="https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg"
                    alt="Amazon Hero Banner"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1500'}
                />
            </div>

            <div className="home-cards-layer">
                <div style={{ background: 'white', padding: '10px 20px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                    You are on Amazon Clone. Shop millions of products with fast local delivery.{' '}
                    <Link to="/search">Browse All Products →</Link>
                </div>

                <div className="grid-container">
                    {loading
                        ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
                        : cards.filter(c => c.products.length > 0).map((card, i) => {
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

export default HomePage;

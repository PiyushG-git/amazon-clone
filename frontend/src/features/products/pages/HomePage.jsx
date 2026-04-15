import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import './HomePageStatic.css';

const FALLBACK = 'https://projectfba.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/07/no-image-logo.jpg.webp';

/* ── tiny helpers ── */
const fmt = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const Img = ({ src, alt, style, className }) => (
  <img
    src={src}
    alt={alt}
    style={style}
    className={className}
    loading="lazy"
    onError={(e) => { e.target.src = FALLBACK; }}
  />
);

/* ── Skeleton helpers ── */
const SkeletonQuad = () => (
  <div className="amz-card">
    <div className="skeleton" style={{ height: 22, width: '70%', marginBottom: 12 }} />
    <div className="amz-card-grid">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="skeleton" style={{ height: 100, marginBottom: 6 }} />
          <div className="skeleton skeleton-text" />
        </div>
      ))}
    </div>
    <div className="skeleton" style={{ height: 14, width: '40%', marginTop: 'auto' }} />
  </div>
);

const SkeletonStrip = ({ count = 8 }) => (
  <div className="h-scroll">
    {[...Array(count)].map((_, i) => (
      <div key={i} style={{ flexShrink: 0 }}>
        <div className="skeleton" style={{ width: 150, height: 160, borderRadius: 4 }} />
        <div className="skeleton skeleton-text" style={{ marginTop: 6, width: 130 }} />
        <div className="skeleton skeleton-text short" style={{ marginTop: 4, width: 80 }} />
      </div>
    ))}
  </div>
);

/* ── QuadCard (2×2 grid inside a white card) ── */
const QuadCard = ({ title, items, linkTo, linkText }) => (
  <div className="amz-card">
    <h2>{title}</h2>
    <div className="amz-card-grid">
      {items.slice(0, 4).map((p) => (
        <Link to={`/product/${p.id}`} className="amz-quad-item" key={p.id}>
          <Img src={p.image_url} alt={p.name} className="amz-quad-img" />
          <span className="amz-quad-title">{p.name}</span>
        </Link>
      ))}
    </div>
    <Link to={linkTo} className="amz-card-link">{linkText}</Link>
  </div>
);

/* ── HorizontalStrip ── */
const HStrip = ({ title, seeMore, items, loading }) => (
  <div className="h-strip">
    <div className="h-strip-header">
      <h2>{title}</h2>
      {seeMore && <Link to="/search" className="amz-card-link" style={{ fontSize: 13 }}>{seeMore}</Link>}
    </div>
    {loading ? <SkeletonStrip /> : (
      <div className="h-scroll">
        {items.map((p) => (
          <Link to={`/product/${p.id}`} className="h-strip-item" key={`hs-${p.id}`}>
            <Img src={p.image_url} alt={p.name} />
            <div className="h-strip-item-name">{p.name}</div>
            <div className="h-strip-item-price">{fmt(p.price)}</div>
          </Link>
        ))}
      </div>
    )}
  </div>
);

/* ── SmallProductCard (used in "More items to consider" grids) ── */
const SmallProductCard = ({ p }) => (
  <Link to={`/product/${p.id}`} className="small-prod-card" key={p.id}>
    <Img src={p.image_url} alt={p.name} className="small-prod-img" />
    <div className="small-prod-name">{p.name}</div>
    <div className="small-prod-price">{fmt(p.price)}</div>
    {p.rating && <div className="small-prod-rating">{'★'.repeat(Math.round(p.rating))} <span>{p.rating}</span></div>}
  </Link>
);

/* ── BigFeaturedCard (Large product with thumbnails) ── */
const BigFeaturedCard = ({ title, product, variants = [] }) => {
  if (!product) return null;
  return (
    <div className="amz-card featured-card">
      <h2>{title}</h2>
      <Link to={`/product/${product.id}`} className="featured-main">
        <Img src={product.image_url} alt={product.name} className="featured-img" />
        <div className="featured-info">
          <div className="featured-name">{product.name}</div>
          <div className="featured-price-row">
            <span className="featured-price">{fmt(product.price)}</span>
            <span className="featured-mrp">M.R.P. {fmt(product.price * 1.4)}</span>
          </div>
        </div>
      </Link>
      <div className="featured-variants">
        {variants.slice(0, 4).map((v) => (
          <Link to={`/product/${v.id}`} key={v.id} className="variant-thumb">
            <Img src={v.image_url} alt={v.name} />
          </Link>
        ))}
      </div>
      <Link to="/search" className="amz-card-link">See more</Link>
    </div>
  );
};

/* ── SectionRow: 4 white-card cols ── */
const FourColSection = ({ sections, loading }) => (
  <div className="four-col-section">
    {loading
      ? [...Array(4)].map((_, i) => <SkeletonQuad key={i} />)
      : sections.map((sec, i) => {
          if (sec.type === 'featured') {
             return <BigFeaturedCard key={i} title={sec.title} product={sec.product} variants={sec.variants} />;
          }
          return (
            <div className="amz-card" key={i}>
              <h2>{sec.title}</h2>
              {sec.type === 'quad' ? (
                <>
                  <div className="amz-card-grid">
                    {(sec.items || []).slice(0, 4).map((p) => (
                      <Link to={`/product/${p.id}`} className="amz-quad-item" key={p.id}>
                        <Img src={p.image_url} alt={p.name} className="amz-quad-img" />
                        <span className="amz-quad-title">{p.name}</span>
                      </Link>
                    ))}
                  </div>
                  {sec.linkText && <Link to={sec.linkTo || '/search'} className="amz-card-link">{sec.linkText}</Link>}
                </>
              ) : sec.type === 'tall-2' ? (
                <>
                  <div style={{ display: 'flex', gap: 10, flex: 1 }}>
                    {(sec.items || []).slice(0, 2).map((p) => (
                      <Link to={`/product/${p.id}`} key={p.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <Img src={p.image_url} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'contain' }} />
                        <span className="amz-quad-title">{p.name}</span>
                        <span style={{ fontSize: 12, color: '#B12704', fontWeight: 600 }}>{fmt(p.price)}</span>
                      </Link>
                    ))}
                  </div>
                  {sec.linkText && <Link to={sec.linkTo || '/search'} className="amz-card-link" style={{ marginTop: 10 }}>{sec.linkText}</Link>}
                </>
              ) : (
                <>
                  {sec.content}
                  {sec.linkText && <Link to={sec.linkTo || '/search'} className="amz-card-link">{sec.linkText}</Link>}
                </>
              )}
            </div>
          );
        })
    }
  </div>
);

/* ═══════════════════════════════════════════════════════ */
/*  MAIN PAGE                                             */
/* ═══════════════════════════════════════════════════════ */
const HomePage = () => {
  const { products, loading } = useProducts({ limit: 200 });
  const [heroIdx, setHeroIdx] = useState(0);
  const carouselRef = useRef(null);
  const feedCarouselRef = useRef(null);
  const feedThumbRef = useRef(null);

  const scrollCarousel = (amount) => {
    if (carouselRef.current) {
        carouselRef.current.scrollBy({
            left: amount,
            behavior: "smooth"
        });
    }
  };

  const scrollFeedCarousel = (amount) => {
    if (feedCarouselRef.current) {
        feedCarouselRef.current.scrollBy({
            left: amount,
            behavior: "smooth"
        });
    }
  };

  const handleFeedScroll = () => {
    if (feedCarouselRef.current && feedThumbRef.current) {
        const carousel = feedCarouselRef.current;
        const thumb = feedThumbRef.current;
        const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
        const scrollLeft = carousel.scrollLeft;
        
        if (scrollWidth > 0) {
            const percent = scrollLeft / scrollWidth;
            // Thumb is 100px wide. Max move is container width - 100px.
            const maxMove = carousel.clientWidth - 100;
            thumb.style.left = `${percent * maxMove}px`;
        }
    }
  };
  const heroImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=3000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=3000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=3000&auto=format&fit=crop',
  ];

  /* ── Category buckets ── */
  const byCategory = (cat, n) => products.filter(p => p.category === cat).slice(0, n);
  const laptops   = byCategory('Laptops', 20);
  const headphones = byCategory('Headphones', 20);
  const mobiles    = byCategory('Mobiles', 20);
  const furniture  = byCategory('Furniture', 20);
  const kitchen    = byCategory('Kitchen', 20);
  const beauty     = byCategory('Beauty', 20);
  const monitors   = byCategory('Monitors', 20);
  const cameras    = byCategory('Cameras', 20);
  const clothing   = byCategory('Clothing', 20);
  const grocery    = byCategory('Grocery', 20);
  const mixed      = products.filter(p => p.category === 'Mixed').slice(0, 20);
  const deals      = laptops.slice(4, 12);
  const topPicks   = [...headphones.slice(0, 2), ...monitors.slice(0, 2)];
  const homeDecor  = [...furniture.slice(0, 2), ...kitchen.slice(0, 2)];
  const viewed     = laptops.slice(0, 12);
  const moreItems  = kitchen.filter(p => p.name.includes('Refrigerator')).slice(0, 12);
  const additional = headphones.slice(0, 12);
  const continueShopping = beauty.slice(0, 12);
  const keepShopping1 = laptops.slice(0, 4);
  const keepShopping2 = headphones.slice(0, 4);
  const exploreMore  = [...kitchen.slice(0, 4), ...furniture.slice(0, 4)];
  const moreConsider = headphones.slice(4, 12);

  return (
    <div style={{ background: '#e3e6e6' }}>

      {/* ══ HERO BANNER ══ */}
      <div className="hero-container">
        <img
          className="hero-img"
          src={heroImages[heroIdx]}
          alt="Amazon Hero Banner"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1500'; }}
        />
        <button className="hero-arrow hero-arrow-left" onClick={() => setHeroIdx((heroIdx - 1 + heroImages.length) % heroImages.length)}>&#8249;</button>
        <button className="hero-arrow hero-arrow-right" onClick={() => setHeroIdx((heroIdx + 1) % heroImages.length)}>&#8250;</button>
      </div>

      {/* ══ MAIN CONTENT LAYER ══ */}
      <div className="home-cards-layer">

        {/* ── ROW 1 : 4-col grid + right-side ad cards ── */}
        <div className="home-row-top">
          {/* Left: 3 quad cards */}
          <div className="home-top-left">
            {loading ? (
              <>
                <SkeletonQuad /><SkeletonQuad /><SkeletonQuad />
              </>
            ) : (
              <>
                {keepShopping1.length >= 2 && (
                  <QuadCard
                    title="Pick up where you left off"
                    items={keepShopping1}
                    linkTo="/search?category=Laptops"
                    linkText="See more"
                  />
                )}
                {mixed.length >= 2 && (
                  <QuadCard
                    title="Keep shopping for"
                    items={mixed}
                    linkTo="/search"
                    linkText="View your browsing history"
                  />
                )}
                {deals.length >= 2 && (
                  <QuadCard
                    title="Continue shopping deals"
                    items={deals}
                    linkTo="/search?category=Laptops"
                    linkText="See more deals"
                  />
                )}
              </>
            )}
          </div>

          {/* Right: Amazon Business + wiltec ad */}
          <div className="home-top-right">
            <div className="amz-card amz-biz-card">
              <div className="amz-biz-top">
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
                    Get bulk discounts +<br />10% Welcome<br />cashback !
                  </h2>
                  <Link to="/search" style={{ fontSize: 13, marginTop: 8, display: 'inline-block' }}>Register now</Link>
                </div>
                <img
                  src="data:image/png;base64,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"
                  alt="Amazon Business"
                  style={{ width: 80, objectFit: 'contain' }}
                />
              </div>
            </div>

            <div className="amz-card amz-ad-card">
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, color: '#007185', fontWeight: 700, margin: 0 }}>wiltec</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.3, margin: '6px 0', fontWeight: 600 }}>
                    BBQ Grill Rost Eckig 3.0 m, blau, Rolla Beitung...
                  </p>
                  <div style={{ fontSize: 12, color: '#007185' }}>★★★★☆ 4.2 <span style={{ color: '#565959' }}>280</span></div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>
                    <sup style={{ fontSize: 10 }}>₹</sup>3,249
                    <span style={{ color: '#00a8e1', fontSize: 12, marginLeft: 6 }}>✓prime</span>
                  </div>
                </div>
                <Img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200"
                  alt="BBQ"
                  style={{ width: 120, height: 140, objectFit: 'cover', borderRadius: 4 }}
                />
              </div>
              <div style={{ textAlign: 'right', fontSize: 10, color: '#888', marginTop: 8 }}>Sponsored ⓘ</div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Deals / Customer picks / Home style / Furniture ── */}
        {/* 
          ── ROW 2 to ROW 8 COMMENTED OUT ── 
          Replacing with static mockup code below
        */}
        {/*
        <FourColSection
          loading={loading}
          sections={[
            {
              title: "Deals related to items you've saved",
              type: 'quad',
              items: deals.slice(0, 4),
              linkTo: '/search?category=Laptops',
              linkText: 'See more deals',
            },
            {
              title: "Customer's most loved picks for you",
              type: 'quad',
              items: topPicks,
              linkTo: '/search',
              linkText: 'Explore More',
            },
            {
              title: 'Revamp your home in style',
              type: 'quad',
              items: homeDecor,
              linkTo: '/search?category=Furniture',
              linkText: 'Explore all',
            },
            {
              title: 'Up to 60% off | Furniture & mattresses',
              type: 'quad',
              items: furniture.slice(0, 4),
              linkTo: '/search?category=Furniture',
              linkText: 'Explore all',
            },
          ]}
        />

        <HStrip
          title="Related to items you've viewed"
          seeMore="See more"
          items={viewed}
          loading={loading}
        />

        {!loading && moreItems.length > 0 && (
          <div className="h-strip">
            <div className="h-strip-header">
              <h2>More items to consider</h2>
              <Link to="/search" className="amz-card-link" style={{ fontSize: 13 }}>See more</Link>
            </div>
            <div className="h-scroll">
              {moreItems.map(p => <SmallProductCard p={p} key={`mic-${p.id}`} />)}
            </div>
          </div>
        )}
        {loading && (
          <div className="h-strip"><h2>More items to consider</h2><SkeletonStrip count={8} /></div>
        )}

        <FourColSection
          loading={loading}
          sections={[
            {
              title: 'Keep shopping for',
              type: 'featured',
              product: laptops[0],
              variants: laptops.slice(1, 5),
            },
            {
              title: 'Continue shopping for',
              type: 'quad',
              items: headphones.slice(0, 4),
              linkTo: '/search?category=Headphones',
              linkText: 'See more',
            },
            {
              title: 'Explore more',
              type: 'quad',
              items: exploreMore.slice(0, 4),
              linkTo: '/search',
              linkText: 'See more',
            },
            {
              title: 'More items to consider',
              type: 'quad',
              items: moreConsider.slice(0, 4),
              linkTo: '/search',
              linkText: 'See more',
            },
          ]}
        />

        {!loading && additional.length > 0 && (
          <div className="h-strip">
            <div className="h-strip-header">
              <h2>Additional items to explore</h2>
              <Link to="/search" className="amz-card-link" style={{ fontSize: 13 }}>See more</Link>
            </div>
            <div className="h-scroll">
              {additional.map(p => <SmallProductCard p={p} key={`add-${p.id}`} />)}
            </div>
          </div>
        )}
        {loading && (
          <div className="h-strip"><h2>Additional items to explore</h2><SkeletonStrip count={8} /></div>
        )}

        <HStrip
          title="Continue shopping for"
          seeMore="See more"
          items={continueShopping}
          loading={loading}
        />

        <HStrip
          title="Best Sellers across all departments"
          seeMore="See all"
          items={[...laptops, ...headphones, ...mobiles].slice(0, 20)}
          loading={loading}
        />
        */}

        {/* ── STATIC MOCKUP ROWS (2-8) ── */}
        <div className="static-rows-container">
            {/* ROW 2: More Grids */}
            <div className="grid-4" id="row-3">
                 <div className="amz-card">
                    <h2>Deals related to items you've saved</h2>
                    <div className="quad-grid">
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Sony Wireless Headphones" />
                            <span className="quad-title">Sony Wireless Headphones</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Bose QuietComfort" />
                            <span className="quad-title">Bose QuietComfort</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Audio-Technica" />
                            <span className="quad-title">Audio-Technica</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Sennheiser HD" />
                            <span className="quad-title">Sennheiser HD</span>
                        </a>
                    </div>
                    <a href="#" className="amz-card-link">See more deals</a>
                </div>

                <div className="amz-card">
                    <h2>Customer's most loved picks</h2>
                    <div className="quad-grid">
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Monitor Arm Stand" />
                            <span className="quad-title">High Resolution Monitor</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Laptop Riser" />
                            <span className="quad-title">Ergonomic Laptop Riser</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1541140134513-85a161dc4a00?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Ergonomic Mouse" />
                            <span className="quad-title">Precision Wireless Mouse</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="External SSD" />
                            <span className="quad-title">Portable External SSD</span>
                        </a>
                    </div>
                    <a href="#" className="amz-card-link">Explore More</a>
                </div>

                <div className="amz-card">
                    <h2>Revamp your home in style</h2>
                    <div className="quad-grid">
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Cushion covers" />
                            <span className="quad-title">Premium Cushion Covers</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Home Figurines" />
                            <span className="quad-title">Artistic Home Decor</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Wall Decor" />
                            <span className="quad-title">Modern Wall Decor</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQkncB0v1PSrHSybod92tSKZAyOcZm0sej2FHlx_qO37SGHUIz_prhCSC02QrxUrok3sY-nZGOd_Dx9VlMZ8maoP3qs6DjZ76JpoO1kUc6V09TIK5sXk_0l" className="quad-img" alt="Lamps & Lighting" />
                            <span className="quad-title">Elegant Table Lamps</span>
                        </a>
                    </div>
                    <a href="#" className="amz-card-link">Explore all</a>
                </div>

                <div className="amz-card">
                    <h2>Up to 60% off | Furniture</h2>
                    <div className="quad-grid">
                        <a href="#" className="quad-item">
                            <img src="https://thesleepwellgallery.com/wp-content/uploads/2023/12/Fitrest_Luxury-1920X1440-1-1696920078996.jpg" className="quad-img" alt="Mattresses & Beds" />
                            <span className="quad-title">Luxury Mattresses</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Office Chairs" />
                            <span className="quad-title">Ergonomic Office Chairs</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Sofas & Couches" />
                            <span className="quad-title">Comfortable Sofas</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Bean Bags" />
                            <span className="quad-title">Designer Bean Bags</span>
                        </a>
                    </div>
                    <a href="#" className="amz-card-link">Explore all</a>
                </div>
            </div>

            {/* ROW 3: Related to viewed */}
            <div className="h-strip" id="row-4">
                <div className="h-strip-header">
                    <h2>Related to items you've viewed</h2>
                    <a href="#" className="amz-card-link" style={{ padding: 0 }}>See more</a>
                </div>
                <div className="h-scroll">
                    <a href="#" className="h-item"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop" alt="item" /></a>
                    <a href="#" className="h-item"><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop" alt="item" /></a>
                    <a href="#" className="h-item"><img src="https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=300&auto=format&fit=crop" alt="item" /></a>
                    <a href="#" className="h-item"><img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300&auto=format&fit=crop" alt="item" /></a>
                    <a href="#" className="h-item"><img src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=300&auto=format&fit=crop" alt="item" /></a>
                    <a href="#" className="h-item"><img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=300&auto=format&fit=crop" alt="item" /></a>
                    <a href="#" className="h-item"><img src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=300&auto=format&fit=crop" alt="item" /></a>
                    <a href="#" className="h-item"><img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop" alt="item" /></a>
                </div>
            </div>
            
            {/* ROW 4: More to consider with Carousel Arrows */}
            <div className="carousel-container" id="row-5">
                <div className="h-strip-header">
                    <h2>More items to consider</h2>
                    <a href="#" className="amz-card-link" style={{ padding: 0 }}>See more</a>
                </div>
                <div className="carousel-wrapper">
                    <button className="arrow left" onClick={() => scrollCarousel(-600)}>❮</button>
                    <div className="carousel" ref={carouselRef}>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/71OUu3JeNIL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/81Be1f26lVL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/716vBDytp6L._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/81qhEwftqEL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/71ZlE6arPQL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/71jNbFGAf+L._AC_SY200_.jpg" alt="p" /></div>
                    </div>
                    <button className="arrow right" onClick={() => scrollCarousel(600)}>❯</button>
                </div>
            </div>

            {/* ROW 5: Mixed Layout Grid */}
            <div className="grid-4" id="row-6">
                <div className="amz-card">
                    <h2>Keep shopping for</h2>
                    <a href="#" className="featured-main">
                        <img src="https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=600&auto=format&fit=crop" className="featured-img" alt="featured" />
                        <div style={{ fontSize: '14px', marginTop: '10px' }}>ASUS Vivobook 15, Intel Core i3-1215U, 15.6" Full HD...</div>
                        <div className="featured-price">₹34,990 <span style={{ fontSize: '11px', fontWeight: 400, color: '#555' }}>M.R.P: ₹52,000</span></div>
                    </a>
                    <div className="featured-variants">
                        <img src="https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=100&auto=format&fit=crop" className="variant-thumb" alt="v1" />
                        <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=100&auto=format&fit=crop" className="variant-thumb" alt="v2" />
                        <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=100&auto=format&fit=crop" className="variant-thumb" alt="v3" />
                    </div>
                    <a href="#" className="amz-card-link">See more</a>
                </div>

                <div className="amz-card">
                    <h2>Continue shopping for</h2>
                    <div className="quad-grid">
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Echo Pop" />
                            <span className="quad-title">Echo Pop | Smart speaker</span>
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>₹3,499</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://m.media-amazon.com/images/I/71jNr0MoZEL._SY450_.jpg" className="quad-img" alt="Echo Dot" />
                            <span className="quad-title">Echo Dot 5th Gen</span>
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>₹5,499</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Echo Show" />
                            <span className="quad-title">Echo Show 8</span>
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>₹9,999</span>
                        </a>
                        <a href="#" className="quad-item">
                            <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Echo Buds" />
                            <span className="quad-title">Premium Echo Buds</span>
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>₹10,999</span>
                        </a>
                    </div>
                    <a href="#" className="amz-card-link">See more</a>
                </div>

                <div className="amz-card">
                    <h2>Explore more</h2>
                    <div className="quad-grid">
                        <a href="#" className="quad-item"><img src="https://m.media-amazon.com/images/I/61exJWcysXL._SX522_.jpg" className="quad-img" alt="Gadget 1" /><span className="quad-title">Pro Webcam 4K</span></a>
                        <a href="#" className="quad-item"><img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Gadget 2" /><span className="quad-title">Mechanical Keyboard</span></a>
                        <a href="#" className="quad-item"><img src="https://blog-cdn.athom.com/uploads/2019/08/Homey-Pro-1-2000x1125.png" className="quad-img" alt="Gadget 3" /><span className="quad-title">Smart Home Hub</span></a>
                        <a href="#" className="quad-item"><img src="https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Gadget 4" /><span className="quad-title">Wireless Trackpad</span></a>
                    </div>
                    <a href="#" className="amz-card-link">See more</a>
                </div>

                <div className="amz-card">
                    <h2>More items to consider</h2>
                    <div className="quad-grid">
                        <a href="#" className="quad-item"><img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Headphones" /><span className="quad-title">Studio Headphones</span></a>
                        <a href="#" className="quad-item"><img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Earbuds" /><span className="quad-title">Wireless Earbuds</span></a>
                        <a href="#" className="quad-item"><img src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTDxPi_QkEM2MTEZDZszBRZ_g3Gg0yR6X7E6n5ecrZ_HuPuPVPah0gtTJY4U6t2RuN93BTcdId3llqzj47dgsp3d-mq8ohmwqEfeavaHTOZnyBur8RjN5pI" className="quad-img" alt="Speakers" /><span className="quad-title">Smart Speakers</span></a>
                        <a href="#" className="quad-item"><img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=300&auto=format&fit=crop" className="quad-img" alt="Mics" /><span className="quad-title">Pro Microphones</span></a>
                    </div>
                    <a href="#" className="amz-card-link">See more</a>
                </div>
            </div>

            {/* ROW 6: Related items Feed Carousel */}
            <div className="feed-carousel-container" id="row-7">
                <div className="h-strip-header">
                    <h2>Related to items you've viewed</h2>
                    <a href="#" className="amz-card-link" style={{ padding: 0 }}>See more</a>
                </div>
                <div className="feed-carousel-wrapper">
                    <button className="arrow left" onClick={() => scrollFeedCarousel(-600)}>❮</button>
                    <div className="carousel" ref={feedCarouselRef} onScroll={handleFeedScroll}>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/51L2Npe3BPL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/61s7RbrPLNL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/61FbYHYB1DL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/616XlmzI0zL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/71PxkYFHoRL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/61o+E9FTbuL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/61GelOnsPKL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/61mBfPeI9DL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/61zBDzg3xaL._AC_SY200_.jpg" alt="p" /></div>
                        <div className="card"><img src="https://m.media-amazon.com/images/I/51pd+cQ9lzL._AC_SY200_.jpg" alt="p" /></div>
                    </div>
                    <button className="arrow right" onClick={() => scrollFeedCarousel(600)}>❯</button>
                    
                    <div className="scrollbar">
                        <div className="thumb" ref={feedThumbRef}></div>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default HomePage;

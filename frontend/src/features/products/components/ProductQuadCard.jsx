import React from 'react';
import { Link } from 'react-router-dom';

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

export default ProductQuadCard;

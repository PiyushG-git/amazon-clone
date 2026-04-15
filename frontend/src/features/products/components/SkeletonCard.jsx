import React from 'react';

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

export default SkeletonCard;

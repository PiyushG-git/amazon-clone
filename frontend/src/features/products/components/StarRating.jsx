import React from 'react';

const StarRating = ({ rating = 0, count = 0, size = 'sm' }) => {
    const ratingNum = parseFloat(rating) || 0;
    const full  = Math.floor(ratingNum);
    const half  = ratingNum - full >= 0.3 && ratingNum - full < 0.8;
    const empty = 5 - full - (half ? 1 : 0);

    return (
        <div className="star-rating" title={`${ratingNum} out of 5`}>
            <span className="stars" style={{ fontSize: size === 'sm' ? 13 : 16 }}>
                {'★'.repeat(full)}
                {half ? '½' : ''}
                {'☆'.repeat(empty)}
            </span>
            {count > 0 && (
                <span className="rating-count">
                    {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
                </span>
            )}
        </div>
    );
};

export default StarRating;

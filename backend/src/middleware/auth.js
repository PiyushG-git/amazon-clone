import jwt from 'jsonwebtoken';
import redis from '../config/cache.js';

export default async function auth(req, res, next) {
    // Get token from cookie or header
    let token = req.cookies.token || req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Check if token is blacklisted in Redis
        const isBlacklisted = await redis.get(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is invalid (logged out)' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.user = decoded.user;
        req.token = token; // Attach token for logout blacklisting
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

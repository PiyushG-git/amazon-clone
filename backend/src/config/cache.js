import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
    host: (process.env.REDIS_HOST || '127.0.0.1').trim(),
    port: parseInt((process.env.REDIS_PORT || '6379').trim(), 10),
    password: (process.env.REDIS_PASSWORD || undefined)?.trim(),
    // Reconnect strategy: retry 3 times, then give up gracefully
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
        if (times > 3) {
            console.error('Redis: Max retries reached. Giving up.');
            return null; // stop retrying
        }
        return Math.min(times * 200, 2000); // exponential backoff
    },
    enableOfflineQueue: false,
});

redis.on('connect', () => {
    console.log('✅ Server is connected to Redis');
});

redis.on('error', (err) => {
    console.error('❌ Redis Error:', err.message);
});

export default redis;

const redis = require('redis');
require('dotenv').config();

let redisClient = null;

if (process.env.REDIS_ENABLED === 'true') {
  redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
    password: process.env.REDIS_PASSWORD || undefined,
    database: parseInt(process.env.REDIS_DB, 10) || 0,
  });

  redisClient.on('error', (err) => console.error('Redis error:', err.message));

  (async () => {
    try {
      await redisClient.connect();
      console.log('Redis connected');
    } catch (err) {
      console.error('Redis connection failed:', err.message);
    }
  })();
}

const cache = {
  get: async (key) => {
    if (!redisClient || !redisClient.isOpen) return null;
    const val = await redisClient.get(key);
    return val ? JSON.parse(val) : null;
  },
  set: async (key, value, ttlSec = 300) => {
    if (!redisClient || !redisClient.isOpen) return false;
    await redisClient.setEx(key, ttlSec, JSON.stringify(value));
    return true;
  },
  del: async (key) => {
    if (!redisClient || !redisClient.isOpen) return false;
    await redisClient.del(key);
    return true;
  },
};

module.exports = { redisClient, cache };

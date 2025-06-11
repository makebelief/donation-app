import Redis from 'ioredis';
import logger from './logger';

const isDevelopment = process.env.NODE_ENV === 'development';
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create a mock Redis client for development if Redis is not available
class MockRedis {
  private store: Map<string, string>;

  constructor() {
    this.store = new Map();
  }

  async get(key: string) {
    return this.store.get(key) || null;
  }

  async setex(key: string, seconds: number, value: string) {
    this.store.set(key, value);
    setTimeout(() => this.store.delete(key), seconds * 1000);
    return 'OK';
  }

  async del(key: string) {
    this.store.delete(key);
    return 1;
  }

  async flushall() {
    this.store.clear();
    return 'OK';
  }

  async keys(pattern: string) {
    return Array.from(this.store.keys());
  }

  on(event: string, callback: Function) {
    if (event === 'connect') {
      callback();
    }
    return this;
  }
}

let redis: Redis | MockRedis;

if (isDevelopment) {
  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy() {
        return null; // Disable retries in development
      }
    });

    // If Redis connection fails, use MockRedis
    redis.on('error', (error) => {
      logger.warn('Redis not available, using in-memory cache', { error: error.message });
      redis = new MockRedis();
    });
  } catch (error) {
    logger.warn('Redis not available, using in-memory cache');
    redis = new MockRedis();
  }
} else {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    reconnectOnError(err) {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
  });

  redis.on('error', (error) => {
    logger.error('Redis Client Error', { error: error.message });
  });

  redis.on('connect', () => {
    logger.info('Redis Client Connected');
  });
}

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error('Cache Get Error', { error, key });
    return null;
  }
};

export const setCache = async <T>(
  key: string,
  value: T,
  expirySeconds = 3600
): Promise<void> => {
  try {
    const stringValue = JSON.stringify(value);
    await redis.setex(key, expirySeconds, stringValue);
  } catch (error) {
    logger.error('Cache Set Error', { error, key });
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    logger.error('Cache Delete Error', { error, key });
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    await redis.flushall();
  } catch (error) {
    logger.error('Cache Clear Error', { error });
  }
};

export const getCacheKeys = async (pattern: string): Promise<string[]> => {
  try {
    return await redis.keys(pattern);
  } catch (error) {
    logger.error('Cache Keys Error', { error, pattern });
    return [];
  }
};

export default redis; 
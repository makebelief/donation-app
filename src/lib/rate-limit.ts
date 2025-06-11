import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import redis from './cache';
import logger from './logger';

const WINDOW_SIZE_IN_SECONDS = 900; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per window

interface RateLimitConfig {
  windowSize?: number;
  maxRequests?: number;
  keyPrefix?: string;
}

interface RateLimitError extends Error {
  status?: number;
}

export async function rateLimit(
  event: RequestEvent,
  config: RateLimitConfig = {}
) {
  const {
    windowSize = WINDOW_SIZE_IN_SECONDS,
    maxRequests = MAX_REQUESTS_PER_WINDOW,
    keyPrefix = 'rate-limit:'
  } = config;

  const ip = event.getClientAddress();
  const key = `${keyPrefix}${ip}`;

  try {
    const multi = redis.multi();
    const now = Math.floor(Date.now() / 1000);

    // Remove old requests outside the window
    multi.zremrangebyscore(key, 0, now - windowSize);
    // Add current request
    multi.zadd(key, now, `${now}-${Math.random()}`);
    // Count requests in window
    multi.zcard(key);
    // Set expiry on the key
    multi.expire(key, windowSize);

    const results = await multi.exec();
    if (!results) {
      throw new Error('Failed to execute Redis commands');
    }

    const requestCount = results[2]?.[1];
    if (typeof requestCount !== 'number') {
      throw new Error('Failed to get request count');
    }

    // Set rate limit headers
    event.setHeaders({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, maxRequests - requestCount).toString(),
      'X-RateLimit-Reset': (now + windowSize).toString()
    });

    if (requestCount > maxRequests) {
      logger.warn('Rate limit exceeded', { ip, count: requestCount, maxRequests });
      throw error(429, 'Too many requests');
    }

    return requestCount;
  } catch (err) {
    const rateLimitError = err as RateLimitError;
    if (rateLimitError.status === 429) {
      throw err;
    }
    logger.error('Rate limiting error', { error: err, ip });
    // Continue processing the request if rate limiting fails
    return 0;
  }
}

// Higher-level middleware for different rate limit configurations
export const standardRateLimit = (event: RequestEvent) =>
  rateLimit(event, {
    windowSize: 900, // 15 minutes
    maxRequests: 100,
    keyPrefix: 'standard:'
  });

export const strictRateLimit = (event: RequestEvent) =>
  rateLimit(event, {
    windowSize: 60, // 1 minute
    maxRequests: 10,
    keyPrefix: 'strict:'
  });

export const authRateLimit = (event: RequestEvent) =>
  rateLimit(event, {
    windowSize: 300, // 5 minutes
    maxRequests: 20,
    keyPrefix: 'auth:'
  }); 
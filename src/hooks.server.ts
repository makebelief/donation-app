import { error, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import logger from '$lib/logger';
import { standardRateLimit } from '$lib/rate-limit';
import { authenticateAdmin } from '$lib/server/auth';

// Log all requests
const requestLogger: Handle = async ({ event, resolve }) => {
  const start = Date.now();
  const { method, url, headers } = event.request;
  const clientIp = event.getClientAddress();

  try {
    const response = await resolve(event);
    const duration = Date.now() - start;

    logger.info('Request processed', {
      method,
      url,
      status: response.status,
      duration,
      clientIp,
      userAgent: headers.get('user-agent')
    });

    return response;
  } catch (err) {
    const duration = Date.now() - start;
    logger.error('Request failed', {
      method,
      url,
      duration,
      clientIp,
      error: err,
      userAgent: headers.get('user-agent')
    });
    throw err;
  }
};

// Global error handler
const errorHandler: Handle = async ({ event, resolve }) => {
  try {
    const response = await resolve(event);
    return response;
  } catch (err: any) {
    logger.error('Unhandled error', {
      error: err,
      url: event.request.url,
      method: event.request.method
    });

    // Handle known errors
    if (err.status >= 400 && err.status < 500) {
      throw err;
    }

    // Convert unknown errors to 500
    throw error(
      500,
      'An unexpected error occurred. Please try again later.'
    );
  }
};

// Rate limiting
const rateLimiter: Handle = async ({ event, resolve }) => {
  // Skip rate limiting for static assets
  if (event.url.pathname.startsWith('/static/')) {
    return resolve(event);
  }

  await standardRateLimit(event);
  return resolve(event);
};

// Security headers
const securityHeaders: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  if (event.url.protocol === 'https:') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

// Combine all middleware in the correct order
export const handle: Handle = sequence(
  requestLogger,
  rateLimiter,
  authenticateAdmin,
  errorHandler,
  securityHeaders
); 
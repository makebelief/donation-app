import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import redis from '$lib/cache';
import logger from '$lib/logger';
import { mpesa } from '$lib/mpesa';

const prisma = new PrismaClient();

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: {
      status: 'healthy' | 'unhealthy';
      latency: number;
    };
    redis: {
      status: 'healthy' | 'unhealthy';
      latency: number;
    };
    mpesa: {
      status: 'healthy' | 'unhealthy';
      environment: string;
    };
  };
}

async function checkDatabase(): Promise<{ status: 'healthy' | 'unhealthy'; latency: number }> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'healthy',
      latency: Date.now() - start
    };
  } catch (error) {
    logger.error('Database health check failed', { error });
    return {
      status: 'unhealthy',
      latency: -1
    };
  }
}

async function checkRedis(): Promise<{ status: 'healthy' | 'unhealthy'; latency: number }> {
  const start = Date.now();
  try {
    await redis.ping();
    return {
      status: 'healthy',
      latency: Date.now() - start
    };
  } catch (error) {
    logger.error('Redis health check failed', { error });
    return {
      status: 'unhealthy',
      latency: -1
    };
  }
}

async function checkMPesa(): Promise<{ status: 'healthy' | 'unhealthy'; environment: string }> {
  try {
    // We don't want to make actual API calls to M-Pesa for health checks
    // Instead, we just verify the configuration is present
    return {
      status: process.env.MPESA_CONSUMER_KEY ? 'healthy' : 'unhealthy',
      environment: process.env.MPESA_ENV || 'sandbox'
    };
  } catch (error) {
    logger.error('M-Pesa health check failed', { error });
    return {
      status: 'unhealthy',
      environment: 'unknown'
    };
  }
}

export const GET: RequestHandler = async () => {
  const [database, redis, mpesaStatus] = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkMPesa()
  ]);

  const health: HealthStatus = {
    status: database.status === 'healthy' && redis.status === 'healthy'
      ? 'healthy'
      : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    services: {
      database,
      redis,
      mpesa: mpesaStatus
    }
  };

  // Log health check results
  logger.info('Health check performed', health);

  // Return 503 if any critical service is unhealthy
  const httpStatus = health.status === 'healthy' ? 200 : 503;

  return json(health, { status: httpStatus });
}; 
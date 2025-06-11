import { SignJWT, jwtVerify } from 'jose';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import logger from './logger';

const prisma = new PrismaClient();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-jwt-secret-key-min-32-chars'
);

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function generateToken(user: { id: string; email: string; role: string }): Promise<string> {
  try {
    const token = await new SignJWT({ email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    return token;
  } catch (err) {
    logger.error('Token Generation Error', { error: err });
    throw error(500, 'Failed to generate token');
  }
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
      iat: payload.iat,
      exp: payload.exp
    };
  } catch (err) {
    logger.error('Token Verification Error', { error: err });
    throw error(401, 'Invalid or expired token');
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw error(401, 'Invalid credentials');
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw error(401, 'Invalid credentials');
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return { user, token };
  } catch (err) {
    logger.error('Authentication Error', { error: err, email });
    throw error(500, 'Authentication failed');
  }
}

export async function requireAuth(event: RequestEvent) {
  const authHeader = event.request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw error(401, 'No token provided');
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyToken(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub }
  });

  if (!user) {
    throw error(401, 'User not found');
  }

  return { user, payload };
}

export function requireRole(roles: string[]) {
  return async (event: RequestEvent) => {
    const { user } = await requireAuth(event);
    if (!roles.includes(user.role)) {
      throw error(403, 'Insufficient permissions');
    }
    return user;
  };
}

export const isAdmin = requireRole(['ADMIN']);
export const isUser = requireRole(['USER', 'ADMIN']); 
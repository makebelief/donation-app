import { error, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import jwt from 'jsonwebtoken';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function validateCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw error(401, 'Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw error(401, 'Invalid credentials');
  }

  return user;
}

export async function validateAdmin(event: RequestEvent) {
  const token = event.cookies.get('admin_token');

  if (!token) {
    throw error(401, 'Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      throw error(403, 'Forbidden');
    }

    return user;
  } catch (err) {
    throw error(401, 'Invalid token');
  }
}

export const authenticateAdmin: Handle = async ({ event, resolve }) => {
  // Skip auth for public routes and auth-related routes
  if (event.url.pathname === '/login' || 
      event.url.pathname === '/api/auth/login' ||
      event.url.pathname === '/api/auth/logout' ||
      event.url.pathname === '/api/auth/check' ||
      !event.url.pathname.startsWith('/admin')) {
    return resolve(event);
  }

  const token = event.cookies.get('admin_token');
  
  // Handle admin routes
  if (!token) {
    // Redirect to login with the current URL as redirect parameter
    const redirectUrl = encodeURIComponent(event.url.pathname);
    return new Response(null, {
      status: 302,
      headers: { Location: `/login?redirect=${redirectUrl}` }
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      event.cookies.delete('admin_token', { path: '/' });
      const redirectUrl = encodeURIComponent(event.url.pathname);
      return new Response(null, {
        status: 302,
        headers: { Location: `/login?redirect=${redirectUrl}` }
      });
    }

    event.locals.user = user;
    return resolve(event);
  } catch (err) {
    event.cookies.delete('admin_token', { path: '/' });
    const redirectUrl = encodeURIComponent(event.url.pathname);
    return new Response(null, {
      status: 302,
      headers: { Location: `/login?redirect=${redirectUrl}` }
    });
  }
};

export const handle = sequence(authenticateAdmin); 
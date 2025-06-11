import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const GET: RequestHandler = async ({ cookies }) => {
  try {
    const token = cookies.get('admin_token');

    if (!token) {
      return json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return json({ error: 'Not authorized' }, { status: 403 });
    }

    return json(user);
  } catch (err) {
    console.error('Auth check error:', err);
    return json({ error: 'Authentication failed' }, { status: 401 });
  }
}; 
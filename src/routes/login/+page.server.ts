import { redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import jwt from 'jsonwebtoken';
import { validateCredentials } from '$lib/server/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const load: PageServerLoad = async ({ locals, url }) => {
  // If user is already logged in and is an admin, redirect to admin dashboard
  if (locals.user?.role === 'ADMIN') {
    throw redirect(302, '/admin');
  }

  return {
    error: url.searchParams.get('error'),
    redirect: url.searchParams.get('redirect') || '/admin'
  };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    if (!email || !password) {
      throw error(400, 'Email and password are required');
    }

    try {
      const user = await validateCredentials(email, password);

      if (user.role !== 'ADMIN') {
        throw error(403, 'Access denied');
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '24h'
      });

      // Set cookie
      cookies.set('admin_token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return { success: true };
    } catch (err) {
      throw error(401, 'Invalid credentials');
    }
  }
}; 
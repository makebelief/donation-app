import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '$lib/server/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt:', { email });
    
    const db = await getDb();

    // Log the user query
    console.log('Looking up user with email:', email);
    const user = await db.get(
      'SELECT id, email, password, role FROM users WHERE email = ?',
      email
    );
    console.log('User found:', user ? { ...user, password: '[REDACTED]' } : null);

    if (!user || user.role !== 'ADMIN') {
      console.log('User not found or not admin:', { found: !!user, role: user?.role });
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Log password check
    console.log('Checking password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    cookies.set('admin_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    console.log('Login successful for:', email);
    return json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return json({ error: 'An error occurred while logging in' }, { status: 500 });
  }
}; 
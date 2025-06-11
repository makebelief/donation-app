import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// The auth middleware now handles the login page access control
export const load = async ({ cookies }: RequestEvent) => {
  // No need for additional checks here
}; 
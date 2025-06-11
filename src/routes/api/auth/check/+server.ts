import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (locals.user.role !== 'ADMIN') {
    return json({ error: 'Not authorized' }, { status: 403 });
  }

  return json({
    isAdmin: true,
    user: {
      id: locals.user.id,
      email: locals.user.email
    }
  });
}; 
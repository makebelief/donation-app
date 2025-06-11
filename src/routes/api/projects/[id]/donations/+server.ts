import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/database';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const donations = await db.all(`
      SELECT 
        id,
        amount,
        created_at as date,
        status
      FROM donations
      WHERE project_id = ? AND status = 'completed'
      ORDER BY created_at DESC
    `, params.id);

    return json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}; 
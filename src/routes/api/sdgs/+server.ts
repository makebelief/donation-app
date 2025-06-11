import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/database';

export const GET: RequestHandler = async () => {
  try {
    const sdgs = await db.all(`
      SELECT id, name, icon
      FROM sdgs
      ORDER BY id
    `);

    return json(sdgs);
  } catch (error) {
    console.error('Error fetching SDGs:', error);
    return json({ error: 'Failed to fetch SDGs' }, { status: 500 });
  }
}; 
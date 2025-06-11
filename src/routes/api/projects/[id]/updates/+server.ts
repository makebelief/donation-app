import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/database';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const updates = await db.all(`
      SELECT 
        u.id,
        u.title,
        u.content,
        u.created_at as date,
        GROUP_CONCAT(i.url) as images
      FROM project_updates u
      LEFT JOIN update_images i ON u.id = i.update_id
      WHERE u.project_id = ?
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `, params.id);

    // Parse image URLs into arrays
    const formattedUpdates = updates.map(update => ({
      ...update,
      images: update.images ? update.images.split(',') : []
    }));

    return json(formattedUpdates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}; 
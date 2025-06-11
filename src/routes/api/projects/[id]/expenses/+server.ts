import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/database';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const expenses = await db.all(`
      SELECT 
        id,
        amount,
        description,
        category,
        created_at as date
      FROM project_expenses
      WHERE project_id = ?
      ORDER BY created_at DESC
    `, params.id);

    return json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}; 
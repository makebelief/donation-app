import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/database';

export const GET: RequestHandler = async ({ params }) => {
  try {
    // Get impact metrics
    const impact = await db.get(`
      SELECT 
        (
          SELECT COUNT(DISTINCT beneficiary_id)
          FROM project_beneficiaries
          WHERE project_id = ?
        ) as beneficiariesReached,
        (
          SELECT COUNT(*)
          FROM project_timeline
          WHERE project_id = ? AND status = 'completed'
        ) as completedMilestones,
        (
          SELECT COUNT(*)
          FROM project_timeline
          WHERE project_id = ?
        ) as totalMilestones
    `, [params.id, params.id, params.id]);

    return json(impact);
  } catch (error) {
    console.error('Error fetching impact metrics:', error);
    return json({ error: 'Failed to fetch impact metrics' }, { status: 500 });
  }
}; 
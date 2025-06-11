import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const GET: RequestHandler = async () => {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }

    const stats = {
      totalRaised: db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM donations').get().total,
      projectCount: db.prepare('SELECT COUNT(*) as count FROM projects').get().count,
      donorCount: db.prepare('SELECT COUNT(DISTINCT donor_phone) as count FROM donations').get().count,
      successRate: db.prepare(`
        SELECT 
          ROUND(
            (CAST(SUM(CASE WHEN current_amount >= target_amount THEN 1 ELSE 0 END) AS FLOAT) / 
            NULLIF(COUNT(*), 0)) * 100, 2
          ) as rate
        FROM projects
        WHERE target_amount > 0
      `).get().rate || 0
    };

    return json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}; 
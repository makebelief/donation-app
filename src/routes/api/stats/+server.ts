import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDb } from '$lib/server/database';

export const GET: RequestHandler = async () => {
  const db = await getDb();
  try {
    // Get total donations
    const totalDonations = await db.get(
      `SELECT COUNT(*) as count, SUM(amount) as total 
       FROM donations 
       WHERE status = 'COMPLETED'`
    );

    // Get total projects
    const totalProjects = await db.get(
      `SELECT COUNT(*) as count 
       FROM projects 
       WHERE status = 'ACTIVE'`
    );

    // Get total beneficiaries
    const totalBeneficiaries = await db.get(
      `SELECT SUM(beneficiaries_count) as total 
       FROM projects`
    );

    // Get recent donations
    const recentDonations = await db.all(
      `SELECT d.*, p.title as project_title 
       FROM donations d 
       JOIN projects p ON d.project_id = p.id 
       WHERE d.status = 'COMPLETED' 
       ORDER BY d.created_at DESC 
       LIMIT 5`
    );

    return json({
      totalDonations: {
        count: totalDonations?.count || 0,
        amount: totalDonations?.total || 0
      },
      totalProjects: totalProjects?.count || 0,
      totalBeneficiaries: totalBeneficiaries?.total || 0,
      recentDonations: recentDonations || []
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}; 
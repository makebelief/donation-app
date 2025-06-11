import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDb } from '$lib/server/database';

export const GET: RequestHandler = async ({ locals }) => {
  // Check if user is authenticated and is admin
  if (locals.user?.role !== 'ADMIN') {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();

    // Calculate total donations and amount
    const donationStats = await db.get(`
      SELECT 
        COUNT(*) as total_count,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(AVG(amount), 0) as avg_amount
      FROM donations
      WHERE status = 'completed'
    `);

    // Calculate project stats
    const projectStats = await db.get(`
      SELECT 
        COUNT(*) as total_projects,
        SUM(CASE WHEN raised_amount >= target_amount THEN 1 ELSE 0 END) as completed_projects,
        SUM(CASE WHEN raised_amount < target_amount THEN 1 ELSE 0 END) as active_projects
      FROM projects
    `);

    // Calculate success rate
    const successRate = projectStats?.total_projects > 0 
      ? Math.round((projectStats.completed_projects / projectStats.total_projects) * 100) 
      : 0;

    // Calculate monthly growth (comparing this month to last month)
    const monthlyGrowth = await db.get(`
      WITH current_month AS (
        SELECT COALESCE(SUM(amount), 0) as amount
        FROM donations
        WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
        AND status = 'completed'
      ),
      last_month AS (
        SELECT COALESCE(SUM(amount), 0) as amount
        FROM donations
        WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', datetime('now', '-1 month'))
        AND status = 'completed'
      )
      SELECT 
        CASE 
          WHEN last_month.amount > 0 
          THEN ROUND(((current_month.amount - last_month.amount) / last_month.amount) * 100)
          ELSE 0
        END as growth_rate
      FROM current_month, last_month
    `);

    // Get recent donations
    const recentDonations = await db.all(`
      SELECT 
        d.id,
        d.amount,
        d.created_at as date,
        p.title as project_title,
        d.donor_name
      FROM donations d
      JOIN projects p ON d.project_id = p.id
      WHERE d.status = 'completed'
      ORDER BY d.created_at DESC
      LIMIT 10
    `);

    // Get recent projects with progress
    const recentProjects = await db.all(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.raised_amount,
        p.target_amount,
        p.status,
        p.created_at,
        ROUND((CAST(p.raised_amount AS FLOAT) / CAST(p.target_amount AS FLOAT)) * 100) as progress,
        COUNT(DISTINCT d.id) as donation_count
      FROM projects p
      LEFT JOIN donations d ON p.id = d.project_id AND d.status = 'completed'
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    // Calculate total impact (sum of beneficiaries across all projects)
    const impactResult = await db.get(`
      SELECT COALESCE(SUM(beneficiaries_count), 0) as total
      FROM projects
    `);

    const stats = {
      totalDonations: Number(donationStats?.total_amount) || 0,
      totalDonationsCount: Number(donationStats?.total_count) || 0,
      averageDonation: Number(donationStats?.avg_amount) || 0,
      activeProjects: Number(projectStats?.active_projects) || 0,
      completedProjects: Number(projectStats?.completed_projects) || 0,
      successRate,
      monthlyGrowth: Number(monthlyGrowth?.growth_rate) || 0,
      totalImpact: Number(impactResult?.total) || 0,
      recentDonations: (recentDonations || []).map(d => ({
        id: d.id,
        amount: Number(d.amount),
        date: new Date(d.date).toISOString(),
        project_title: d.project_title,
        donor_name: d.donor_name || 'Anonymous'
      })),
      recentProjects: (recentProjects || []).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        raised_amount: Number(p.raised_amount),
        target_amount: Number(p.target_amount),
        status: p.status,
        created_at: new Date(p.created_at).toISOString(),
        progress: Number(p.progress),
        donation_count: Number(p.donation_count)
      }))
    };

    return json(stats);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}; 
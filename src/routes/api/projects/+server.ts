import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDb } from '$lib/server/database';

interface Project {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  raised_amount: number;
  status: string;
  beneficiaries_count: number;
  created_at: string;
  updated_at: string;
}

interface ProjectWithStats extends Project {
  donation_count: number;
  total_donations: number;
  progress: number;
}

export const GET: RequestHandler = async () => {
  try {
    const db = await getDb();
    
    const projects = await db.all(`
      SELECT 
        p.*,
        COUNT(DISTINCT d.id) as donation_count,
        COALESCE(SUM(d.amount), 0) as total_donations
      FROM projects p
      LEFT JOIN donations d ON p.id = d.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `) as (Project & { donation_count: number; total_donations: number; })[];

    // Format projects data
    const formattedProjects: ProjectWithStats[] = projects.map(project => ({
      ...project,
      target_amount: Number(project.target_amount),
      raised_amount: Number(project.raised_amount),
      donation_count: Number(project.donation_count),
      total_donations: Number(project.total_donations),
      progress: Math.round((Number(project.raised_amount) / Number(project.target_amount)) * 100),
      created_at: new Date(project.created_at).toISOString(),
      updated_at: new Date(project.updated_at).toISOString()
    }));

    return json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
};

// Create a new project (admin only)
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Check if user is authenticated and is admin
    if (locals.user?.role !== 'ADMIN') {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const data = await request.json();
    const { title, description, target_amount, beneficiaries_count = 0 } = data;

    if (!title || !description || !target_amount) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.run(`
      INSERT INTO projects (
        title, 
        description, 
        target_amount,
        beneficiaries_count,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [title, description, target_amount, beneficiaries_count]);

    return json({ 
      success: true, 
      id: result.lastID,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return json({ error: 'Failed to create project' }, { status: 500 });
  }
}; 
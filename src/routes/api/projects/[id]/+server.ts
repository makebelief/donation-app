import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/database';
import type { Project, SDG, ProjectGoal, ProjectTimeline, ImpactStory } from '$lib/types';

interface ProjectDetails extends Project {
  goals?: ProjectGoal[];
  timeline?: ProjectTimeline[];
  sdgs?: SDG[];
  impact_stories?: ImpactStory[];
}

export const GET: RequestHandler = async ({ params }) => {
  try {
    const project = await db.get<ProjectDetails & {
      goals: string | null;
      timeline: string | null;
      sdgs: string | null;
      impact_stories: string | null;
    }>(`
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT g.goal) as goals,
        GROUP_CONCAT(DISTINCT t.title || '|' || t.description || '|' || t.date) as timeline,
        GROUP_CONCAT(DISTINCT s.name || '|' || s.icon) as sdgs,
        GROUP_CONCAT(DISTINCT i.quote || '|' || i.name || '|' || i.role) as impact_stories
      FROM projects p
      LEFT JOIN project_goals g ON p.id = g.project_id
      LEFT JOIN project_timeline t ON p.id = t.project_id
      LEFT JOIN project_sdgs ps ON p.id = ps.project_id
      LEFT JOIN sdgs s ON ps.sdg_id = s.id
      LEFT JOIN impact_stories i ON p.id = i.project_id
      WHERE p.id = ?
      GROUP BY p.id
    `, params.id);

    if (!project) {
      return json({ error: 'Project not found' }, { status: 404 });
    }

    // Parse concatenated strings into arrays/objects
    const formattedProject: ProjectDetails = {
      ...project,
      goals: project.goals ? project.goals.split(',').map(goal => ({ goal })) : [],
      timeline: project.timeline ? project.timeline.split(',').map(t => {
        const [title, description, date] = t.split('|');
        return { title, description, date, status: 'pending' };
      }) : [],
      sdgs: project.sdgs ? project.sdgs.split(',').map(s => {
        const [name, icon] = s.split('|');
        return { name, icon } as SDG;
      }) : [],
      impact_stories: project.impact_stories ? project.impact_stories.split(',').map(s => {
        const [quote, name, role] = s.split('|');
        return { quote, name, role, created_at: new Date().toISOString() };
      }) : []
    };

    return json(formattedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    return json({ error: 'Failed to fetch project details' }, { status: 500 });
  }
};

// Update project details (admin only)
export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const data = await request.json();
    
    // In production, add authentication check here
    // if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });

    const { title, description, target_amount } = data;

    await db.run(`
      UPDATE projects
      SET title = ?, description = ?, target_amount = ?, updated_at = datetime('now')
      WHERE id = ?
    `, title, description, target_amount, params.id);

    return json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return json({ error: 'Failed to update project' }, { status: 500 });
  }
};

// Add a project update (admin only)
export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const data = await request.json();
    
    // In production, add authentication check here
    // if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });

    const { title, content } = data;

    await db.run(`
      INSERT INTO project_updates (project_id, title, content, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `, params.id, title, content);

    return json({ success: true });
  } catch (error) {
    console.error('Error adding project update:', error);
    return json({ error: 'Failed to add project update' }, { status: 500 });
  }
};

// Delete a project (admin only)
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    // In production, add authentication check here
    // if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });

    await db.run('DELETE FROM projects WHERE id = ?', params.id);
    
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return json({ error: 'Failed to delete project' }, { status: 500 });
  }
}; 
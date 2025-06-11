import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { validateAdmin } from '$lib/server/auth';

export async function GET(event: RequestEvent) {
  try {
    await validateAdmin(event);

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { donations: true }
        }
      }
    });

    return json(projects);
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }
}

export async function POST(event: RequestEvent) {
  try {
    await validateAdmin(event);

    const data = await event.request.json();
    const { title, description, target_amount, location, category, image, status } = data;

    // Validate required fields
    if (!title || !description || !target_amount || !location || !category || !status) {
      throw new Error('Missing required fields');
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        goal: target_amount,
        imageUrl: image,
        location,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        impactMetric: 'People helped',
        targetBeneficiaries: 0
      }
    });

    return json(project);
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }
} 
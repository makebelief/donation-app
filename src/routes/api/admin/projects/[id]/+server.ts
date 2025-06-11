import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { validateAdmin } from '$lib/server/auth';

export async function PUT(event: RequestEvent) {
  try {
    await validateAdmin(event);

    const { id } = event.params;
    const data = await event.request.json();
    const { title, description, target_amount, location, category, image, status } = data;

    // Validate required fields
    if (!title || !description || !target_amount || !location || !category || !status) {
      throw new Error('Missing required fields');
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        goal: target_amount,
        imageUrl: image,
        location
      }
    });

    return json(project);
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(event: RequestEvent) {
  try {
    await validateAdmin(event);

    const { id } = event.params;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Delete project
    await prisma.project.delete({
      where: { id }
    });

    return json({ success: true });
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }
}

// Helper function for image upload (implement your own logic)
async function uploadImage(file: File): Promise<string> {
  // Implement your image upload logic here
  // This could involve uploading to a cloud storage service like AWS S3
  return 'placeholder-url';
} 
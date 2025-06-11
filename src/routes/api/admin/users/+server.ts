import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { validateAdmin } from '$lib/server/auth';

export async function GET(event: RequestEvent) {
  try {
    await validateAdmin(event);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return json(users);
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}

export async function POST(event: RequestEvent) {
  try {
    await validateAdmin(event);

    const data = await event.request.json();
    const { email, name, role, phone, status } = data;

    // Validate required fields
    if (!email || !role || !status) {
      throw new Error('Missing required fields');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        phone,
        status
      }
    });

    return json(user);
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
} 
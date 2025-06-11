import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { validateAdmin } from '$lib/server/auth';

export async function PUT(event: RequestEvent) {
  try {
    await validateAdmin(event);

    const { id } = event.params;
    const data = await event.request.json();
    const { email, name, role, phone, status } = data;

    // Validate required fields
    if (!email || !role || !status) {
      throw new Error('Missing required fields');
    }

    // Check if email is taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser && existingUser.id !== id) {
      throw new Error('Email is already taken by another user');
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        name,
        role,
        phone,
        status
      }
    });

    return json(user);
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(event: RequestEvent) {
  try {
    await validateAdmin(event);

    const { id } = event.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    return json({ success: true });
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(event: RequestEvent) {
  try {
    await validateAdmin(event);

    const { id } = event.params;
    const data = await event.request.json();
    const { status } = data;

    if (!status) {
      throw new Error('Status is required');
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status }
    });

    return json(user);
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }
} 
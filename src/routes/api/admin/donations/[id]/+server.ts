import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    const { id } = params;
    const { status } = await request.json();

    const donation = await prisma.donation.update({
      where: { id },
      data: { status },
      include: {
        donor: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        project: {
          select: {
            title: true
          }
        }
      }
    });

    return json(donation);
  } catch (err) {
    console.error('Error updating donation:', err);
    throw error(500, 'Internal server error');
  }
}; 
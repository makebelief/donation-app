import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { validateAdmin } from '$lib/server/auth';

export async function GET(event: RequestEvent) {
  try {
    await validateAdmin(event);

    const startDate = event.url.searchParams.get('startDate');
    const endDate = event.url.searchParams.get('endDate');
    const status = event.url.searchParams.get('status');
    const minAmount = event.url.searchParams.get('minAmount');
    const maxAmount = event.url.searchParams.get('maxAmount');

    // Build where clause
    const where: any = {};
    if (startDate) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(startDate)
      };
    }
    if (endDate) {
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(endDate)
      };
    }
    if (status && status !== 'all') {
      where.status = status;
    }
    if (minAmount) {
      where.amount = {
        ...where.amount,
        gte: parseFloat(minAmount)
      };
    }
    if (maxAmount) {
      where.amount = {
        ...where.amount,
        lte: parseFloat(maxAmount)
      };
    }

    // Get donations with filters
    const donations = await prisma.donation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

    return json(donations);
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }
} 
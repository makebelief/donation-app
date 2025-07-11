import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDb } from '$lib/server/database';

export const GET: RequestHandler = async ({ params }) => {
  const db = await getDb();
  try {
    const { checkoutRequestId } = params;
    
    const donation = await db.get(
      `SELECT * FROM donations WHERE mpesa_checkout_id = ?`,
      [checkoutRequestId]
    );

    if (!donation) {
      return json({ 
        status: 'NOT_FOUND',
        message: 'Payment request not found'
      }, { status: 404 });
    }

    return json({
      status: donation.status,
      message: donation.status === 'COMPLETED' 
        ? 'Payment completed successfully'
        : donation.status === 'FAILED'
        ? 'Payment failed'
        : 'Payment pending'
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return json({ 
      status: 'ERROR',
      message: 'Failed to check payment status'
    }, { status: 500 });
  }
}; 
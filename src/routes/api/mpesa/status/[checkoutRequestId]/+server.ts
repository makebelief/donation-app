import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { checkoutRequestId } = params;

    const paymentRequest = db.prepare(`
      SELECT status, error_message 
      FROM payment_requests 
      WHERE checkout_request_id = ?
    `).get(checkoutRequestId);

    if (!paymentRequest) {
      return json({ error: 'Payment request not found' }, { status: 404 });
    }

    return json({
      status: paymentRequest.status,
      error: paymentRequest.error_message
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    return json({ error: 'Failed to check payment status' }, { status: 500 });
  }
}; 
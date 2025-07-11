import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDb } from '$lib/server/database';

// Default test values when env vars are not available
const MPESA_CONSUMER_KEY = 'test_consumer_key';
const MPESA_CONSUMER_SECRET = 'test_consumer_secret';
const MPESA_PASSKEY = 'test_passkey';
const MPESA_SHORTCODE = '174379'; // Safaricom test shortcode

export const POST: RequestHandler = async ({ request }) => {
  const db = await getDb();
  try {
    const { phoneNumber, amount, projectId } = await request.json();

    // For development, just create a pending donation
    const result = await db.run(
      `INSERT INTO donations (
        amount,
        status,
        project_id,
        phone_number,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [amount, 'PENDING', projectId, phoneNumber]
    );

    return json({
      success: true,
      message: 'Payment request initiated',
      data: {
        CheckoutRequestID: 'test-' + Date.now(),
        ResponseDescription: 'Success. Request accepted for processing',
        ResponseCode: '0'
      }
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    return json({ 
      success: false,
      message: 'Failed to initiate payment request'
    }, { status: 500 });
  }
}; 
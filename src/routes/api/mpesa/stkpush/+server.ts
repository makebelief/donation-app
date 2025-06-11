import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_PASSKEY, MPESA_SHORTCODE } from '$env/static/private';
import { db } from '$lib/server/database';

// M-Pesa API URLs
const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

async function getAccessToken() {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  
  const response = await fetch(MPESA_AUTH_URL, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });

  if (!response.ok) throw new Error('Failed to get M-Pesa access token');
  
  const data = await response.json();
  return data.access_token;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { projectId, amount, phoneNumber } = await request.json();

    // Validate inputs
    if (!projectId || !amount || !phoneNumber) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get project details
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!project) {
      return json({ error: 'Project not found' }, { status: 404 });
    }

    // Format timestamp
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    
    // Generate password
    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Get access token
    const accessToken = await getAccessToken();

    // Prepare STK push request
    const stkRequest = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.PUBLIC_BASE_URL}/api/mpesa/callback`,
      AccountReference: `Project-${projectId}`,
      TransactionDesc: `Donation to ${project.title}`
    };

    // Send STK push request
    const response = await fetch(MPESA_STK_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkRequest)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('M-Pesa STK push error:', error);
      return json({ error: 'Failed to initiate payment' }, { status: 500 });
    }

    const result = await response.json();

    // Store payment request in database
    db.prepare(`
      INSERT INTO payment_requests (
        checkout_request_id,
        project_id,
        amount,
        phone_number,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(
      result.CheckoutRequestID,
      projectId,
      amount,
      phoneNumber,
      'PENDING'
    );

    return json({
      checkoutRequestId: result.CheckoutRequestID,
      message: 'Payment request initiated'
    });
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    return json({ error: 'Failed to process payment' }, { status: 500 });
  }
}; 
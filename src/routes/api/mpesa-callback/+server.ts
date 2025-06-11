import { json } from '@sveltejs/kit';
import { updateDonationStatus, updateProjectAmount } from '$lib/db/index.js';
import { processCallback } from '$lib/mpesa/index.js';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const result = processCallback(data);

    if (!result.success) {
      return json(
        { error: result.error },
        { status: 400 }
      );
    }

    const { amount, mpesaReceiptNumber, phoneNumber } = result.data;

    // Update donation status
    const donation = await updateDonationStatus(
      data.Body.stkCallback.CheckoutRequestID,
      'completed',
      mpesaReceiptNumber
    );

    // Update project amount
    await updateProjectAmount(donation.project_id, amount);

    return json({ success: true });
  } catch (error) {
    console.error('Error processing Mpesa callback:', error);
    return json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
} 
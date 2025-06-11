import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Get the payment request
    const paymentRequest = db.prepare(`
      SELECT * FROM payment_requests 
      WHERE checkout_request_id = ?
    `).get(data.Body.stkCallback.CheckoutRequestID);

    if (!paymentRequest) {
      console.error('Payment request not found:', data.Body.stkCallback.CheckoutRequestID);
      return json({ error: 'Payment request not found' }, { status: 404 });
    }

    // Update payment request status
    if (data.Body.stkCallback.ResultCode === 0) {
      // Payment successful
      const items = data.Body.stkCallback.CallbackMetadata.Item;
      const amount = items.find(i => i.Name === 'Amount').Value;
      const mpesaReceiptNumber = items.find(i => i.Name === 'MpesaReceiptNumber').Value;
      const transactionDate = items.find(i => i.Name === 'TransactionDate').Value;
      const phoneNumber = items.find(i => i.Name === 'PhoneNumber').Value;

      // Begin transaction
      db.transaction(() => {
        // Update payment request status
        db.prepare(`
          UPDATE payment_requests 
          SET status = ?, 
              mpesa_receipt = ?,
              completed_at = datetime('now')
          WHERE checkout_request_id = ?
        `).run('COMPLETED', mpesaReceiptNumber, data.Body.stkCallback.CheckoutRequestID);

        // Create donation record
        db.prepare(`
          INSERT INTO donations (
            project_id,
            amount,
            phone_number,
            mpesa_receipt,
            status,
            transaction_date,
            created_at
          ) VALUES (?, ?, ?, ?, ?, datetime(?), datetime('now'))
        `).run(
          paymentRequest.project_id,
          amount,
          phoneNumber,
          mpesaReceiptNumber,
          'completed',
          transactionDate
        );

        // Update project raised amount
        db.prepare(`
          UPDATE projects 
          SET raised_amount = raised_amount + ?
          WHERE id = ?
        `).run(amount, paymentRequest.project_id);
      })();
    } else {
      // Payment failed
      db.prepare(`
        UPDATE payment_requests 
        SET status = ?,
            error_code = ?,
            error_message = ?,
            completed_at = datetime('now')
        WHERE checkout_request_id = ?
      `).run(
        'FAILED',
        data.Body.stkCallback.ResultCode,
        data.Body.stkCallback.ResultDesc,
        data.Body.stkCallback.CheckoutRequestID
      );
    }

    return json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    return json({ error: 'Failed to process callback' }, { status: 500 });
  }
}; 
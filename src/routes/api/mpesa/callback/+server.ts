import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDb } from '$lib/server/database';

export const POST: RequestHandler = async ({ request }) => {
  const db = await getDb();
  try {
    const data = await request.json();
    
    // Process M-Pesa callback data
    const { 
      TransactionType,
      TransID,
      TransTime,
      TransAmount,
      BusinessShortCode,
      BillRefNumber,
      InvoiceNumber,
      OrgAccountBalance,
      ThirdPartyTransID,
      MSISDN,
      FirstName,
      MiddleName,
      LastName
    } = data;

    // Update donation status
    await db.run(
      `UPDATE donations 
       SET status = 'COMPLETED', 
           transaction_id = ?, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [TransID, BillRefNumber]
    );

    // Update project raised amount
    await db.run(
      `UPDATE projects 
       SET raised_amount = raised_amount + ?,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = (
         SELECT project_id 
         FROM donations 
         WHERE id = ?
       )`,
      [TransAmount, BillRefNumber]
    );

    return json({ 
      ResultCode: 0,
      ResultDesc: "Confirmation received successfully"
    });
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    return json({ 
      ResultCode: 1,
      ResultDesc: "Error processing callback"
    }, { status: 500 });
  }
}; 
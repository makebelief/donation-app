import axios from 'axios';

const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

// Get OAuth token
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  
  try {
    const response = await axios.get(MPESA_AUTH_URL, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Mpesa access token:', error);
    throw new Error('Failed to get Mpesa access token');
  }
}

// Generate password
function generatePassword(timestamp: string): string {
  const str = `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`;
  return Buffer.from(str).toString('base64');
}

// Initiate STK Push
export async function initiateSTKPush(phoneNumber: string, amount: number, accountReference: string) {
  try {
    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = generatePassword(timestamp);

    const requestData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: `Donation for ${accountReference}`
    };

    const response = await axios.post(MPESA_STK_URL, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error initiating STK push:', error);
    return {
      success: false,
      error: 'Failed to initiate payment'
    };
  }
}

// Process callback
export function processCallback(callbackData: any) {
  try {
    const { Body } = callbackData;
    
    if (Body.stkCallback.ResultCode === 0) {
      // Payment successful
      const { CallbackMetadata } = Body.stkCallback;
      const amount = CallbackMetadata.Item.find((item: any) => item.Name === 'Amount').Value;
      const mpesaReceiptNumber = CallbackMetadata.Item.find((item: any) => item.Name === 'MpesaReceiptNumber').Value;
      const phoneNumber = CallbackMetadata.Item.find((item: any) => item.Name === 'PhoneNumber').Value;
      
      return {
        success: true,
        data: {
          amount,
          mpesaReceiptNumber,
          phoneNumber
        }
      };
    } else {
      // Payment failed
      return {
        success: false,
        error: Body.stkCallback.ResultDesc
      };
    }
  } catch (error) {
    console.error('Error processing callback:', error);
    return {
      success: false,
      error: 'Failed to process callback'
    };
  }
} 
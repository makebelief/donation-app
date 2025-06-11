import axios from 'axios';
import logger from './logger';

interface MPesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  callbackUrl: string;
  environment: 'sandbox' | 'production';
}

interface MPesaAuthResponse {
  access_token: string;
  expires_in: string;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

class MPesaService {
  private config: MPesaConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      consumerKey: process.env.MPESA_CONSUMER_KEY || '',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
      passkey: process.env.MPESA_PASSKEY || '',
      shortcode: process.env.MPESA_SHORTCODE || '',
      callbackUrl: process.env.MPESA_CALLBACK_URL || '',
      environment: (process.env.MPESA_ENV || 'sandbox') as 'sandbox' | 'production'
    };

    this.baseUrl = this.config.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

    this.validateConfig();
  }

  private validateConfig() {
    const requiredFields = [
      'consumerKey',
      'consumerSecret',
      'passkey',
      'shortcode',
      'callbackUrl'
    ];

    const missingFields = requiredFields.filter(field => !this.config[field as keyof MPesaConfig]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required M-Pesa configuration: ${missingFields.join(', ')}`);
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      // Check if we have a valid cached token
      if (this.accessToken && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const auth = Buffer.from(
        `${this.config.consumerKey}:${this.config.consumerSecret}`
      ).toString('base64');

      const response = await axios.get<MPesaAuthResponse>(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (parseInt(response.data.expires_in) * 1000);

      return this.accessToken;
    } catch (error) {
      logger.error('M-Pesa authentication failed', { error });
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  private generateTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private generatePassword(timestamp: string): string {
    const str = this.config.shortcode + this.config.passkey + timestamp;
    return Buffer.from(str).toString('base64');
  }

  public async initiateSTKPush(
    phoneNumber: string,
    amount: number,
    accountReference: string,
    transactionDesc: string
  ): Promise<STKPushResponse> {
    try {
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      const accessToken = await this.getAccessToken();

      // Format phone number (remove leading 0 or +254)
      const formattedPhone = phoneNumber.replace(/^(?:0|\+254)/, '254');

      const response = await axios.post<STKPushResponse>(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.config.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(amount),
          PartyA: formattedPhone,
          PartyB: this.config.shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: this.config.callbackUrl,
          AccountReference: accountReference,
          TransactionDesc: transactionDesc
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('STK push initiated', {
        phoneNumber: formattedPhone,
        amount,
        reference: accountReference,
        response: response.data
      });

      return response.data;
    } catch (error) {
      logger.error('STK push failed', {
        error,
        phoneNumber,
        amount,
        reference: accountReference
      });
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  public async checkTransactionStatus(checkoutRequestId: string): Promise<any> {
    try {
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      const accessToken = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: this.config.shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Transaction status checked', {
        checkoutRequestId,
        response: response.data
      });

      return response.data;
    } catch (error) {
      logger.error('Transaction status check failed', {
        error,
        checkoutRequestId
      });
      throw new Error('Failed to check transaction status');
    }
  }
}

// Export singleton instance
export const mpesa = new MPesaService(); 
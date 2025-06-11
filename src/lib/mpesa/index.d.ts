declare module '$lib/mpesa/index.js' {
  export interface MpesaResponse {
    success: boolean;
    data?: any;
    error?: string;
  }

  export function initiateSTKPush(phoneNumber: string, amount: number, accountReference: string): Promise<MpesaResponse>;
  export function processCallback(callbackData: any): MpesaResponse;
} 
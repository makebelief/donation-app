export const APP_NAME = 'Donation App';
export const APP_DESCRIPTION = 'Empowering change through transparent and impactful donations';
export const CONTACT_EMAIL = 'support@donationapp.com';
export const SUPPORT_PHONE = '+254700000000';

export const CURRENCY = 'KES';
export const MIN_DONATION_AMOUNT = 100;
export const MAX_DONATION_AMOUNT = 1000000;

export const API_BASE_URL = '/api';
export const MPESA_PAYBILL = '123456';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5
};

export const AUTH = {
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
}; 
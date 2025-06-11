export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    SESSION_EXPIRED: 'Your session has expired. Please log in again',
    ACCOUNT_LOCKED: 'Your account has been locked due to too many failed attempts',
    ACCOUNT_SUSPENDED: 'Your account has been suspended. Please contact support'
  },
  
  VALIDATION: {
    REQUIRED_FIELD: (field: string) => `${field} is required`,
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_AMOUNT: 'Please enter a valid amount',
    PASSWORD_REQUIREMENTS: 'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character'
  },
  
  PAYMENT: {
    FAILED: 'Payment failed. Please try again',
    CANCELLED: 'Payment was cancelled',
    TIMEOUT: 'Payment request timed out',
    MPESA_FAILED: 'M-PESA payment failed. Please try again'
  },
  
  SERVER: {
    INTERNAL_ERROR: 'An unexpected error occurred. Please try again later',
    NOT_FOUND: 'The requested resource was not found',
    RATE_LIMIT: 'Too many requests. Please try again later',
    MAINTENANCE: 'System is under maintenance. Please try again later'
  }
} as const; 
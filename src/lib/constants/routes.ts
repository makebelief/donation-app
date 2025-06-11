type Routes = {
  HOME: string;
  ABOUT: string;
  CONTACT: string;
  LOGIN: string;
  REGISTER: string;
  PROJECTS: string;
  PROJECT_DETAILS: (id: string) => string;
  DONATE: string;
  DONATE_PROJECT: (id: string) => string;
  THANK_YOU: string;
  ADMIN: {
    DASHBOARD: string;
    PROJECTS: string;
    PROJECT_EDIT: (id: string) => string;
    DONATIONS: string;
    USERS: string;
    SETTINGS: string;
  };
  API: {
    AUTH: {
      LOGIN: string;
      LOGOUT: string;
      ME: string;
    };
    PROJECTS: string;
    PROJECT: (id: string) => string;
    DONATIONS: string;
    DONATION: (id: string) => string;
    MPESA: {
      STK_PUSH: string;
      CALLBACK: string;
      STATUS: (id: string) => string;
    };
  };
};

export const ROUTES: Routes = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  PROJECTS: '/projects',
  PROJECT_DETAILS: (id) => `/projects/${id}`,
  DONATE: '/donate',
  DONATE_PROJECT: (id) => `/donate/${id}`,
  THANK_YOU: '/thank-you',
  
  ADMIN: {
    DASHBOARD: '/admin',
    PROJECTS: '/admin/projects',
    PROJECT_EDIT: (id) => `/admin/projects/${id}`,
    DONATIONS: '/admin/donations',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings'
  },
  
  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me'
    },
    PROJECTS: '/api/projects',
    PROJECT: (id) => `/api/projects/${id}`,
    DONATIONS: '/api/donations',
    DONATION: (id) => `/api/donations/${id}`,
    MPESA: {
      STK_PUSH: '/api/mpesa/stkpush',
      CALLBACK: '/api/mpesa/callback',
      STATUS: (id) => `/api/mpesa/status/${id}`
    }
  }
}; 
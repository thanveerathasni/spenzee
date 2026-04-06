export const SYSTEM_MESSAGES = {
  CONFIG: {
    MISSING_JWT_SECRETS: "JWT secrets are not defined",
    MISSING_MAIL_CONFIG: "Mail config missing",
  },
  STARTUP: {
    APP_INITIALIZED: "App initialized",
  },
  ERROR: {
    UNHANDLED: "Unhandled Error",
  },
} as const;

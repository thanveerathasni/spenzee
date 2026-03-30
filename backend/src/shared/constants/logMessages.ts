export const LOG_MESSAGES = {
  AUTH: {
    LOGIN_ATTEMPT: "User login attempt",
    LOGIN_SUCCESS: "User login success",
    LOGIN_FAILED: "User login failed",
   
  },

  PROVIDER: {
    LOGIN_ATTEMPT: "Provider login attempt",
    PASSWORD_SETUP: "Provider password setup",
    DASHBOARD_ACCESSED: "Provider dashboard accessed",
    REQUEST_SUBMITTED: "Provider request submitted",
    REQUEST_REVIEWED: "Review provider request"
  },

  ADMIN: {
    DASHBOARD_ACCESSED: "Admin dashboard accessed",
    LOGIN_ATTEMPT: "Admin login attempt",
    LOGIN_SUCCESS: "Admin login success",
    LOGIN_FAILED: "Admin login failed",
  },

  SYSTEM: {
    APP_STARTED: "Application started",
    ERROR_OCCURRED: "Unhandled error occurred",
  },
} as const;
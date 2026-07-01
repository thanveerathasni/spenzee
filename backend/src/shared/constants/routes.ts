








export const ROUTES = {
  AUTH: {
    BASE: "/auth",
    LOGIN: "/login",
    SIGNUP: "/signup",
    LOGOUT: "/logout",
    REFRESH: "/refresh",
    VERIFY_OTP: "/verify-otp",
    RESEND_OTP: "/resend-otp",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",

    GOOGLE: "/google",
  },

  USER: {
    BASE: "/user",
    PROFILE: "/profile",
    PROFILE_IMAGE: "/profile/image",
    EMAIL_REQUEST: "/email/request",
    EMAIL_CONFIRM: "/email/confirm",
    ADDRESS_BASE: "/addresses",
    ADDRESS_BY_ID: "/addresses/:id",
    ADDRESS_PRIMARY: "/addresses/:id/primary",
    ADDRESS_PRIMARY_CURRENT: "/addresses/primary/current",
    VERIFICATION: "/verification",
    VERIFICATION_STATUS: "/verification/status",
    BANK_UPLOAD_ACCESS: "/bank-statements/access",
    BANK_STATEMENTS_UPLOAD: "/bank-statements/upload",
    BANK_STATEMENTS: "/bank-statements",
    BANK_STATEMENT_BY_ID: "/bank-statements/:id",
    BANK_STATEMENTS_ANALYTICS: "/bank-statements/analytics",
    BANK_STATEMENTS_TRANSACTIONS: "/bank-statements/transactions",
    EMAIL_SEND_OTP: "/user/email/send-otp",
    EMAIL_VERIFY_OTP: "/user/email/verify-otp",
    EMAIL_UPDATE: "/user/email/update",
    PASSWORD_SEND_OTP: "/user/password/send-otp",
    PASSWORD_VERIFY_OTP: "/user/password/verify-otp",
    PASSWORD_UPDATE: "/user/password/update",
  },

  ADMIN_USER: {
    USERS: "/users",
    USER_BY_ID: "/users/:id",
    USER_STATUS: "/users/:id/status",
    USER_STATEMENTS: "/users/:id/statements",
    USER_ANALYTICS: "/users/:id/analytics",
    USER_STATEMENT_STATUS: "/users/:id/statements/:statementId/status",
    PROVIDERS: "/providers",
    PROVIDER_COMMERCE:
      "/providers/commerce",
    PROVIDER_BY_ID: "/providers/:id",
    PROVIDER_STATUS: "/providers/:id/status",
    PROVIDER_COMMERCE_APPROVE:
      "/providers/:id/commerce/approve",
    PROVIDER_COMMERCE_REJECT:
      "/providers/:id/commerce/reject",
    PROVIDER_COMMERCE_FREEZE:
      "/providers/:id/commerce/freeze",
    PROVIDER_COMMERCE_RESUME:
      "/providers/:id/commerce/resume",
    PROVIDER_COMMISSION:
      "/providers/:id/commission",
    PROVIDER_REQUESTS: "/provider-requests",
    PROVIDER_REQUEST_REVIEW: "/provider-requests/:id/review",
  },

  PROVIDER_REQUEST: {
    ROOT: "/",
    REQUESTS: "/requests",
  },

  PROVIDER: {
    BASE: "/provider",

    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    REQUEST: "/request",
    REQUESTS: "/requests",
    AUTH_LOGIN: "/auth/login",
    AUTH_SETUP_PASSWORD: "/auth/setup-password",
    AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
    AUTH_RESET_PASSWORD: "/auth/reset-password",
    AUTH_CHANGE_PASSWORD: "/auth/change-password",
    PROFILE: "/profile",
    PROFILE_IMAGE: "/profile/image",
    VERIFICATION: "/verification",
    VERIFICATION_STATUS: "/verification/status",
    EMAIL_CHANGE_REQUEST: "/email/change-request",
    EMAIL_VERIFY: "/email/verify",
    ACCEPT_TERMS: "/accept-terms",
    COMMERCE_STATUS:
      "/commerce-status",

    SETUP_PASSWORD: "/setup-password",

    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    WELCOME: "/provider/welcome",
  },

  ADMIN: {
    BASE: "/admin",
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    USER_VERIFICATIONS: "/verifications/users",
    USER_VERIFICATION_BY_ID: "/verifications/users/:id",
    USER_VERIFICATION_APPROVE: "/verifications/users/:id/approve",
    USER_VERIFICATION_REJECT: "/verifications/users/:id/reject",
    PROVIDER_VERIFICATIONS: "/verifications/providers",
    PROVIDER_VERIFICATION_BY_ID: "/verifications/providers/:id",
    PROVIDER_VERIFICATION_APPROVE: "/verifications/providers/:id/approve",
    PROVIDER_VERIFICATION_REJECT: "/verifications/providers/:id/reject",
  },
} as const;

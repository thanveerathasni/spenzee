export const API_ROUTES = {
  /* ====================================================== */
  /* AUTH */
  /* ====================================================== */

  AUTH: {
    LOGIN: "/auth/login",

    SIGNUP: "/auth/signup",

    LOGOUT: "/auth/logout",

    REFRESH: "/auth/refresh",

    VERIFY_OTP:
      "/auth/verify-otp",

    RESEND_OTP:
      "/auth/resend-otp",

    FORGOT_PASSWORD:
      "/auth/forgot-password",

    RESET_PASSWORD:
      "/auth/reset-password",

    GOOGLE:
      "/auth/google",
  },

  /* ====================================================== */
  /* USER */
  /* ====================================================== */

  USER: {
    PROFILE:
      "/user/profile",

    PROFILE_IMAGE:
      "/user/profile/image",

    EMAIL_REQUEST:
      "/user/email/request",

    EMAIL_CONFIRM:
      "/user/email/confirm",

    ADDRESSES:
      "/user/addresses",

    PRIMARY_ADDRESS:
      "/user/addresses/primary/current",

    ADDRESS_DETAIL:
      (id: string) =>
        `/user/addresses/${id}`,

    ADDRESS_PRIMARY:
      (id: string) =>
        `/user/addresses/${id}/primary`,

    VERIFICATION:
      "/user/verification",

    VERIFICATION_STATUS:
      "/user/verification/status",

    BANK_UPLOAD_ACCESS:
      "/user/bank-statements/access",

    BANK_STATEMENTS_UPLOAD:
      "/user/bank-statements/upload",

    BANK_STATEMENTS:
      "/user/bank-statements",

    BANK_STATEMENTS_ANALYTICS:
      "/user/bank-statements/analytics",

    BANK_STATEMENTS_TRANSACTIONS:
      "/user/bank-statements/transactions",

    PASSWORD_SEND_OTP:
      "/auth/user/password/send-otp",

    PASSWORD_VERIFY_OTP:
      "/auth/user/password/verify-otp",

    PASSWORD_UPDATE:
      "/auth/user/password/update",
  },

  /* ====================================================== */
  /* PROVIDER */
  /* ====================================================== */

  PROVIDER: {
    REQUESTS:
      "/provider/requests",

    LOGIN:
      "/provider/auth/login",

    FORGOT_PASSWORD:
      "/provider/auth/forgot-password",

    RESET_PASSWORD:
      "/provider/auth/reset-password",

    CHANGE_PASSWORD:
      "/provider/auth/change-password",

    DASHBOARD:
      "/provider/dashboard",

    COMMERCE_STATUS:
      "/provider/commerce-status",

    PROFILE:
      "/provider/profile",

    EMAIL_CHANGE_REQUEST:
      "/provider/email/change-request",

    EMAIL_VERIFY:
      "/provider/email/verify",

    ACCEPT_TERMS:
      "/provider/accept-terms",

    VERIFICATION:
      "/provider/verification",

    VERIFICATION_STATUS:
      "/provider/verification/status",
  },

  /* ====================================================== */
  /* ADMIN */
  /* ====================================================== */

  ADMIN: {
    LOGIN:
      "/admin/auth/login",

    DASHBOARD:
      "/admin/dashboard",

    USERS:
      "/admin/users",

    USER_DETAILS:
      (id: string) =>
        `/admin/users/${id}`,

    USER_STATEMENTS:
      (id: string) =>
        `/admin/users/${id}/statements`,

    USER_ANALYTICS:
      (id: string) =>
        `/admin/users/${id}/analytics`,

    USER_STATEMENT_STATUS:
      (
        id: string,
        statementId: string,
      ) =>
        `/admin/users/${id}/statements/${statementId}/status`,

    PROVIDERS:
      "/admin/providers",

    PROVIDER_DETAILS:
      (id: string) =>
        `/admin/providers/${id}`,

    PROVIDER_COMMERCE:
      "/admin/providers/commerce",

    PROVIDER_COMMERCE_APPROVE:
      (id: string) =>
        `/admin/providers/${id}/commerce/approve`,

    PROVIDER_COMMERCE_REJECT:
      (id: string) =>
        `/admin/providers/${id}/commerce/reject`,

    PROVIDER_COMMERCE_FREEZE:
      (id: string) =>
        `/admin/providers/${id}/commerce/freeze`,

    PROVIDER_COMMERCE_RESUME:
      (id: string) =>
        `/admin/providers/${id}/commerce/resume`,

    PROVIDER_COMMISSION:
      (id: string) =>
        `/admin/providers/${id}/commission`,

    USER_VERIFICATIONS:
      "/admin/verifications/users",

    USER_VERIFICATION_DETAIL:
      (id: string) =>
        `/admin/verifications/users/${id}`,

    USER_VERIFICATION_APPROVE:
      (id: string) =>
        `/admin/verifications/users/${id}/approve`,

    USER_VERIFICATION_REJECT:
      (id: string) =>
        `/admin/verifications/users/${id}/reject`,

    PROVIDER_VERIFICATIONS:
      "/admin/verifications/providers",

    PROVIDER_VERIFICATION_DETAIL:
      (id: string) =>
        `/admin/verifications/providers/${id}`,

    PROVIDER_VERIFICATION_APPROVE:
      (id: string) =>
        `/admin/verifications/providers/${id}/approve`,

    PROVIDER_VERIFICATION_REJECT:
      (id: string) =>
        `/admin/verifications/providers/${id}/reject`,
  },
} as const;

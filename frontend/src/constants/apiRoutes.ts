// export const API_ROUTES = {

//   AUTH: {
//     LOGIN: "/auth/login",

//     SIGNUP: "/auth/signup",

//     LOGOUT: "/auth/logout",

//     REFRESH: "/auth/refresh",

//     VERIFY_OTP: "/auth/verify-otp",

//     RESEND_OTP: "/auth/resend-otp",

//     FORGOT_PASSWORD: "/auth/forgot-password",

//     RESET_PASSWORD: "/auth/reset-password",

//     GOOGLE: "/auth/google",
//   },

//   USER: {

//     PROFILE: "/user/profile",

//     UPDATE_PROFILE: "/user/profile",

//     PROFILE_IMAGE: "/user/profile/image",

//     CHANGE_PASSWORD_SEND_OTP:
//       "/user/password/send-otp",

//     CHANGE_PASSWORD_VERIFY_OTP:
//       "/user/password/verify-otp",

//     CHANGE_PASSWORD_UPDATE:
//       "/user/password/update",
//   },

//   PROVIDER: {

//     REQUEST: "/provider/request",

//     LOGIN: "/provider/auth/login",

//     FORGOT_PASSWORD:
//       "/provider/auth/forgot-password",

//     RESET_PASSWORD:
//       "/provider/auth/reset-password",

//     PROFILE: "/provider/profile",

//     UPDATE_PROFILE: "/provider/profile",
//   },

//   ADMIN: {

//     LOGIN: "/admin/auth/login",

//     LOGOUT: "/admin/auth/logout",

//     DASHBOARD: "/admin/dashboard",

//     USERS: "/admin/users",

//     USER_DETAILS: "/admin/users/:id",

//     PROVIDERS: "/admin/providers",

//     PROVIDER_DETAILS: "/admin/providers/:id",

//     SUSPEND_PROVIDER:
//       "/admin/providers/suspend",

//     ACTIVATE_PROVIDER:
//       "/admin/providers/activate",
//   },
// } as const;












export const API_ROUTES = {

  AUTH: {

    LOGIN: "/auth/login",

    SIGNUP: "/auth/signup",

    LOGOUT: "/auth/logout",

    REFRESH: "/auth/refresh",

    VERIFY_OTP: "/auth/verify-otp",

    RESEND_OTP: "/auth/resend-otp",

    FORGOT_PASSWORD: "/auth/forgot-password",

    RESET_PASSWORD: "/auth/reset-password",

    GOOGLE: "/auth/google",
  },

  USER: {

    PROFILE: "/user/profile",

    UPDATE_PROFILE: "/user/profile",

    PROFILE_IMAGE: "/user/profile/image",

    EMAIL_REQUEST: "/user/email/request",

    EMAIL_CONFIRM: "/user/email/confirm",

    ADDRESSES: "/user/addresses",

    PRIMARY_ADDRESS: "/user/addresses/primary/current",

    ADDRESS_DETAIL: (id: string) => `/user/addresses/${id}`,

    ADDRESS_PRIMARY: (id: string) => `/user/addresses/${id}/primary`,

    VERIFICATION: "/user/verification",

    VERIFICATION_STATUS: "/user/verification/status",

    BANK_UPLOAD_ACCESS: "/user/bank-statements/access",

    CHANGE_PASSWORD_SEND_OTP:
      "/user/password/send-otp",

    CHANGE_PASSWORD_VERIFY_OTP:
      "/user/password/verify-otp",

    CHANGE_PASSWORD_UPDATE:
      "/auth/user/password/update",
  },

  PROVIDER: {

    REQUEST: "/provider/request",

    LOGIN: "/provider/auth/login",

    FORGOT_PASSWORD:
      "/provider/auth/forgot-password",

    RESET_PASSWORD:
      "/provider/auth/reset-password",

    PROFILE: "/provider/profile",

    UPDATE_PROFILE: "/provider/profile",

    CHANGE_PASSWORD:
      "/provider/auth/change-password",

    EMAIL_CHANGE_REQUEST:
      "/provider/email/change-request",

    EMAIL_VERIFY:
      "/provider/email/verify",

    ACCEPT_TERMS:
      "/provider/accept-terms",

    VERIFICATION: "/provider/verification",

    VERIFICATION_STATUS: "/provider/verification/status",
  },

  ADMIN: {

    LOGIN: "/admin/auth/login",

    LOGOUT: "/admin/auth/logout",

    DASHBOARD: "/admin/dashboard",

    USERS: "/admin/users",

    USER_DETAILS: "/admin/users/:id",

    PROVIDERS: "/admin/providers",

    PROVIDER_DETAILS: (id: string) =>
      `/admin/providers/${id}`,

    USER_VERIFICATIONS: "/admin/verifications/users",

    USER_VERIFICATION_DETAIL: (id: string) =>
      `/admin/verifications/users/${id}`,

    USER_VERIFICATION_APPROVE: (id: string) =>
      `/admin/verifications/users/${id}/approve`,

    USER_VERIFICATION_REJECT: (id: string) =>
      `/admin/verifications/users/${id}/reject`,

    PROVIDER_VERIFICATIONS: "/admin/verifications/providers",

    PROVIDER_VERIFICATION_DETAIL: (id: string) =>
      `/admin/verifications/providers/${id}`,

    PROVIDER_VERIFICATION_APPROVE: (id: string) =>
      `/admin/verifications/providers/${id}/approve`,

    PROVIDER_VERIFICATION_REJECT: (id: string) =>
      `/admin/verifications/providers/${id}/reject`,

    SUSPEND_PROVIDER:
      "/admin/providers/suspend",

    ACTIVATE_PROVIDER:
      "/admin/providers/activate",
  },
} as const;

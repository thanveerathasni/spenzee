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

  PROVIDER: {
    BASE: "/provider",
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    REQUEST: "/request",
    SETUP_PASSWORD: "/setup-password",
  },

  ADMIN: {
    BASE: "/admin",
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
  },
} as const;
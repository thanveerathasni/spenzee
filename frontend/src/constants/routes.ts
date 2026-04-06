export const ROUTES = {
  PUBLIC: {
    LANDING: "/",
  },

  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
  },

  PASSWORD: {
    FORGOT: "/forgot-password",
    RESET: "/reset-password",
  },

  USER: {
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    WELCOME: "/welcome",
  },

  PROVIDER: {
    LOGIN: "/provider/login",
    REQUEST: "/provider/request",
  },

  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    PROFILE: "/admin/profile",
  },
} as const;
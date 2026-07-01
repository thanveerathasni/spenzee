






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

    VERIFICATION: "/verification",

    FINANCIAL_INSIGHTS:
      "/financial-insights",

    FINANCIAL_INSIGHTS_DASHBOARD:
      "/dashboard/financial-insights",

    FINANCIAL_INSIGHTS_UPLOAD:
      "/financial-insights/upload",

    FINANCIAL_INSIGHTS_STATEMENTS:
      "/financial-insights/statements",

    FINANCIAL_INSIGHTS_ANALYTICS:
      "/financial-insights/analytics",

    ADDRESS_BOOK: "/address-book",
  },

  PROVIDER: {

    LOGIN: "/provider/login",

    REQUEST: "/provider/request",

    DASHBOARD: "/provider/dashboard",

    PROFILE: "/provider/profile",

    WELCOME: "/provider/welcome",

    PENDING: "/provider/pending",

    VERIFICATION:
      "/provider/verification",

    SETUP_PASSWORD:
      "/provider/setup-password",

    FORGOT_PASSWORD:
      "/provider/forgot-password",

    RESET_PASSWORD:
      "/provider/reset-password",
  },

  ADMIN: {

    LOGIN: "/admin/login",

    DASHBOARD: "/admin/dashboard",

    PROFILE: "/admin/profile",

    USERS: "/admin/users",

    USER_DETAILS: (id: string) =>
      `/admin/users/${id}`,

    PROVIDERS: "/admin/providers",

    PROVIDER_DETAILS: (id: string) =>
      `/admin/providers/${id}`,

    USER_VERIFICATIONS:
      "/admin/verifications/users",

    PROVIDER_VERIFICATIONS:
      "/admin/verifications/providers",
  },
} as const;

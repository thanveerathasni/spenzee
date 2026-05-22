// export const ROUTES = {
//   PUBLIC: {
//     LANDING: "/",
//   },

//   AUTH: {
//     LOGIN: "/login",
//     SIGNUP: "/signup",
//   },

//   PASSWORD: {
//     FORGOT: "/forgot-password",
//     RESET: "/reset-password",
//   },

//   USER: {
//     DASHBOARD: "/dashboard",
//     PROFILE: "/profile",
//     WELCOME: "/welcome",
//   },

//   PROVIDER: {
//     LOGIN: "/provider/login",
//     REQUEST: "/provider/request",
//     DASHBOARD: "/provider",
//     PROFILE: "/provider/profile",
//     WELCOME: "/provider/welcome",

//     FORGOT_PASSWORD: "/provider/forgot-password",
//     SETUP_PASSWORD: "/provider/setup-password",
//     RESET_PASSWORD: "/provider/reset-password",
//   },

//   ADMIN: {
//     LOGIN: "/admin/login",
//     DASHBOARD: "/admin/dashboard",
//     PROFILE: "/admin/profile",

//     USERS: "/admin/users",
//     USER_DETAILS: (id: string) => `/admin/users/${id}`,

//     PROVIDERS: "/admin/providers",
//     PROVIDER_DETAILS: (id: string) => `/admin/providers/${id}`,
//   },
// } as const;














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




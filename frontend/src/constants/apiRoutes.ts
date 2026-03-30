export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },

  USER: {
    PROFILE: "/user/profile",
    PROFILE_IMAGE: "/user/profile/image",
  },
} as const;
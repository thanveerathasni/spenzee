export const LOG_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "User logged in",
    LOGOUT: "User logged out",
  },

  USER: {
    FETCH_PROFILE: "Fetching user profile",
    UPDATE_PROFILE: "Updating user profile",
    UPLOAD_IMAGE: "Uploading profile image",
  },
  APP:{
    INITIALIZED: "App initialized",
    SHUTDOWN: "App shutting down",
  }
} as const;
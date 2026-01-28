export const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN: "15m",
  REFRESH_TOKEN_EXPIRES_IN: "7d",
  COOKIE_NAME: "refreshToken",
   REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60 * 1000,
} as const;

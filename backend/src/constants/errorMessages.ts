export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_NOT_FOUND: "User not found",
    USER_ALREADY_EXISTS: "User already exists",
    ACCOUNT_NOT_VERIFIED: "Account not verified",

    ALREADY_VERIFIED: "User already verified",
    NO_OTP_FOUND: "OTP not found. Please signup again.",
    OTP_LIMIT_EXCEEDED: "OTP request limit exceeded. Try again later.",

    OTP_INVALID: "OTP invalid",
    OTP_EXPIRED: "OTP expired",
    REFRESH_TOKEN_INVALID: "Invalid refresh token",
    REFRESH_TOKEN_MISSING: "Refresh token missing",
    RESET_TOKEN_INVALID: "Invalid reset token",
    RESET_TOKEN_EXPIRED: "Reset token expired",

  },

  GENERAL: {
    INTERNAL_SERVER_ERROR: "Something went wrong",
    INVALID_REQUEST: "Invalid request data"
  }
} as const;

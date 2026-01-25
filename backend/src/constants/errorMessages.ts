export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_NOT_FOUND: "User not found",
    USER_ALREADY_EXISTS: "User already exists", // ✅ ADD THIS
    ACCOUNT_NOT_VERIFIED: "Account not verified",
    ACCESS_DENIED: "Access denied",
    REFRESH_TOKEN_MISSING: "Refresh token missing",
    REFRESH_TOKEN_INVALID: "Invalid refresh token",
    OTP_INVALID: "Invalid OTP",
    OTP_EXPIRED: "OTP expired"
  
},

  GENERAL: {
    INTERNAL_SERVER_ERROR: "Something went wrong",
    INVALID_REQUEST: "Invalid request data"
  }
} as const;

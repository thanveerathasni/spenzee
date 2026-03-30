export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Login successful",
    OTP_SENT: "OTP sent to your email",
    ACCOUNT_VERIFIED: "Account verified successfully",
    TOKEN_REFRESHED: "Access token refreshed successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
    OTP_RESENT: "OTP resent successfully",
    PASSWORD_RESET_EMAIL_SENT: "Password reset email sent",
    PASSWORD_RESET_SUCCESS: "Password reset successful",
    GOOGLE_LOGIN_SUCCESS: "Google login successful",
  },
USER: {
  PROFILE_UPDATED: "Profile updated successfully",
},
  ADMIN: {
    DASHBOARD_FETCHED: "Admin dashboard fetched successfully",
    LOGIN_SUCCESS: "Admin login successful",
  },

  PROVIDER: {
    LOGIN_SUCCESS: "Provider login successful",
    PASSWORD_SETUP_SUCCESS: "Provider password setup successful",
    DASHBOARD_FETCHED: "Provider dashboard fetched successfully",
    REQUEST_FETCHED: "Provider requests fetched successfully",
    REQUEST_CREATED: "Provider request created successfully",
  },

} as const;
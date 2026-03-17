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
  OTP: {
    OTP_SENT: "OTP sent successfully",
    OTP_VERIFIED: "OTP verified successfully",
  },
   ADMIN: {
    DASHBOARD_FETCHED: "Admin dashboard fetched successfully",
  },


  PROVIDER: {
    PASSWORD_SETUP_SUCCESS: "Provider password setup successful",
    REQUEST_SUBMITTED: "Provider request submitted successfully",
    REQUEST_APPROVED: "Provider request approved successfully",
    REQUEST_REJECTED: "Provider request rejected successfully",
  },


} as const;

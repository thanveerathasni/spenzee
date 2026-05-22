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
  PROFILE_FETCHED: "Profile fetched successfully",
  PROFILE_IMAGE_REMOVED: "Profile image removed successfully",
  EMAIL_OTP_SENT: "OTP sent to new email",
  EMAIL_UPDATED: "Email updated successfully",
  PASSWORD_UPDATED: "Password updated successfully",
  ADDRESS_CREATED: "Address added successfully",
  ADDRESS_UPDATED: "Address updated successfully",
  ADDRESS_DELETED: "Address deleted successfully",
  ADDRESS_FETCHED: "Addresses fetched successfully",
  ADDRESS_PRIMARY_SET: "Primary address updated successfully",
},
  ADMIN: {
    DASHBOARD_FETCHED: "Admin dashboard fetched successfully",
    LOGIN_SUCCESS: "Admin login successful",
  },

  PROVIDER: {
    LOGIN_SUCCESS: "Provider login successful",
    PASSWORD_SETUP_SUCCESS: "Provider password setup successful",
    PASSWORD_CHANGED: "Password changed successfully",
    DASHBOARD_FETCHED: "Provider dashboard fetched successfully",
    REQUEST_FETCHED: "Provider requests fetched successfully",
    REQUEST_CREATED: "Provider request created successfully",
    FETCHED: "Provider fetched successfully",
    PROFILE_FETCHED: "Provider profile fetched successfully",
    PROFILE_UPDATED: "Provider profile updated successfully",
    EMAIL_OTP_SENT: "OTP sent to provider email",
    EMAIL_UPDATED: "Provider email updated successfully",
    TERMS_ACCEPTED: "Provider terms accepted",
  },

  VERIFICATION: {
    SUBMITTED: "Verification submitted successfully",
    FETCHED: "Verification details fetched successfully",
    APPROVED: "Verification approved successfully",
    REJECTED: "Verification rejected successfully",
    BANK_ACCESS_ALLOWED: "Bank statement upload allowed",
  },

} as const;

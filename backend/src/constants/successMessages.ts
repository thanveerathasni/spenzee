export const SUCCESS_MESSAGES = {
  AUTH: {
      LOGIN_SUCCESS: "Login successful",
    OTP_SENT: "OTP sent to your email",
    ACCOUNT_VERIFIED: "Account verified successfully",
    TOKEN_REFRESHED: "Access token refreshed successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
    OTP_RESENT: "OTP resent successfully",
    PASSWORD_RESET_EMAIL_SENT: "Password reset email sent",
    PASSWORD_RESET_SUCCESS: "Password reset successful"

  },

  PRODUCT: {
    CREATED: "Product created successfully",
    UPDATED: "Product updated successfully",
    DELETED: "Product deleted successfully",
    ARCHIVED: "Product archived successfully",
    RESTORED: "Product restored successfully",
    STOCK_UPDATED: "Product stock updated successfully",
    FETCHED: "Product fetched successfully",
    LIST_FETCHED: "Products fetched successfully",
  },
} as const;

export const LOG_MESSAGES = {
  AUTH: {
    LOGIN_ATTEMPT: "User login attempt",
    LOGIN_SUCCESS: "User login success",
    LOGIN_FAILED: "User login failed",
    LOGOUT: "User logout",
    TOKEN_REFRESH: "Refresh token requested",
    PASSWORD_CHANGE: "Password change requested",
    EMAIL_CHANGE: "Email change requested",
    AUTHORIZATION_FAILED: "Authorization failed",
  },
  USER: {
    PROFILE_FETCHED: "User profile fetched",
    PROFILE_UPDATED: "User profile updated",
    PROFILE_IMAGE_UPLOADED: "User profile image uploaded",
    PROFILE_IMAGE_REMOVED: "User profile image removed",
    ADDRESS_CREATED: "User address created",
    ADDRESS_UPDATED: "User address updated",
    ADDRESS_DELETED: "User address deleted",
    ADDRESS_PRIMARY_SET: "User primary address set",
    VERIFICATION_SUBMITTED: "User verification submitted",
    VERIFICATION_REUPLOADED: "User verification re-uploaded",
    BANK_UPLOAD_BLOCKED: "Bank statement upload blocked",
  },

  VERIFICATION: {
    DOCUMENT_UPLOAD_STARTED: "Verification document upload started",
    DOCUMENT_UPLOAD_COMPLETED: "Verification document upload completed",
    DOCUMENT_UPLOAD_FAILED: "Verification document upload failed",
    USER_UPLOADED: "User identity document uploaded",
    PROVIDER_UPLOADED: "Provider license document uploaded",
    USER_APPROVED: "User verification approved",
    USER_REJECTED: "User verification rejected",
    PROVIDER_APPROVED: "Provider verification approved",
    PROVIDER_REJECTED: "Provider verification rejected",
    ADMIN_REVIEW: "Admin verification moderation action",
    BLOCKED_UPLOAD_ATTEMPT: "Blocked document upload attempt",
  },

  PROVIDER: {
    LOGIN_ATTEMPT: "Provider login attempt",
    PASSWORD_SETUP: "Provider password setup",
    PASSWORD_CHANGE: "Provider password change requested",
    EMAIL_CHANGE: "Provider email change requested",
    EMAIL_UPDATED: "Provider email updated",
    DASHBOARD_ACCESSED: "Provider dashboard accessed",
    REQUEST_SUBMITTED: "Provider request submitted",
    REQUEST_REVIEWED: "Review provider request",
    VERIFICATION_REUPLOADED: "Provider verification re-uploaded",
    COMMERCE_APPROVED: "Provider commerce approved",
    COMMERCE_REJECTED: "Provider commerce rejected",
    COMMERCE_FROZEN: "Provider commerce frozen",
    COMMERCE_RESUMED: "Provider commerce resumed",
    COMMISSION_UPDATED: "Provider commission updated",
  },

  ADMIN: {
    DASHBOARD_ACCESSED: "Admin dashboard accessed",
    LOGIN_ATTEMPT: "Admin login attempt",
    LOGIN_SUCCESS: "Admin login success",
    LOGIN_FAILED: "Admin login failed",
  },

  SYSTEM: {
    APP_STARTED: "Application started",
    ERROR_OCCURRED: "Unhandled error occurred",
  },

  EMAIL: {
    RESET_PASSWORD_SENT: "Reset password email sent",
    OTP_SENT: "OTP email sent",
  },
} as const;

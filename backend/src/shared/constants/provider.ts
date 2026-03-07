export const PROVIDER_PASSWORD_SETUP = {
  TOKEN_EXPIRATION_MS: 60 * 60 * 1000,
} as const;

export const PROVIDER_SUCCESS_MESSAGES = {
  REQUEST_SUBMITTED: "Provider request submitted successfully",
  REQUEST_UPDATED: "Provider request updated successfully",
} as const;

export const PROVIDER_ERROR_MESSAGES = {
  INVALID_STATUS: "Invalid provider request status",
  REQUEST_NOT_FOUND: "Provider request not found",
  ALREADY_REVIEWED: "Provider request already reviewed",
  APPROVAL_FAILED: "Failed to approve provider request",
  REJECTION_FAILED: "Failed to reject provider request",
  NOT_FOUND: "Provider not found",
  NOT_ACTIVE: "Provider account is not active",
  PASSWORD_NOT_SET: "Provider password not set",
  PASSWORD_ALREADY_SET: "Password already set",

  INVALID_SETUP_TOKEN: "Invalid or expired setup token",
  SETUP_TOKEN_EXPIRED: "Setup token has expired",
  SETUP_TOKEN_ALREADY_USED: "Setup token already used",

  TOKEN_AND_PASSWORD_REQUIRED: "Token and password are required",
} as const;
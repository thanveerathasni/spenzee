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
 ACCESS_DENIED: "Access denied",
  },

  PROVIDER_COMMERCE: {
    PENDING: "Provider commerce approval is pending",
    DISABLED: "Provider commerce is disabled",
    REJECTED: "Provider commerce is rejected",
    FROZEN: "Provider commerce is frozen",
    PROVIDER_COMMERCE_PENDING: "Provider commerce approval is pending",
    PROVIDER_COMMERCE_DISABLED: "Provider commerce is disabled",
    PROVIDER_COMMERCE_REJECTED: "Provider commerce is rejected",
    INVALID_COMMISSION: "Commission must be between 0 and 100",
    PROVIDER_NOT_VERIFIED: "Provider verification incomplete",
  },

  PRODUCT: {
    NOT_FOUND: "Product not found",
    FORBIDDEN: "You can manage only your own products",
    DUPLICATE_PIC: "Product identification code already exists for this provider",
    INVALID_PRICE: "Product price cannot be negative",
    INVALID_STOCK: "Product stock cannot be negative",
    NAME_REQUIRED: "Product name is required",
    THUMBNAIL_REQUIRED: "Product thumbnail is required",
    INVALID_IMAGE: "Invalid product image",
    TOO_MANY_IMAGES: "A product can have up to 10 gallery images",
  },

  GENERAL: {
    INTERNAL_SERVER_ERROR: "Something went wrong",
    INVALID_REQUEST: "Invalid request data"
  }
} as const;

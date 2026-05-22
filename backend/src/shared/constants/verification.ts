export const VERIFICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type VerificationStatus =
  (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

export const USER_DOCUMENT_TYPES = {
  AADHAAR: "aadhaar",
  PASSPORT: "passport",
  DRIVING_LICENSE: "driving_license",
  NATIONAL_ID: "national_id",
} as const;

export type UserDocumentType =
  (typeof USER_DOCUMENT_TYPES)[keyof typeof USER_DOCUMENT_TYPES];

export const PROVIDER_LICENSE_TYPES = {
  TRADE_LICENSE: "trade_license",
  GST_CERTIFICATE: "gst_certificate",
  BUSINESS_REGISTRATION: "business_registration",
} as const;

export type ProviderLicenseType =
  (typeof PROVIDER_LICENSE_TYPES)[keyof typeof PROVIDER_LICENSE_TYPES];

export const VERIFICATION_UPLOAD_FOLDERS = {
  USER: "spenzee/user-verifications",
  PROVIDER: "spenzee/provider-verifications",
} as const;

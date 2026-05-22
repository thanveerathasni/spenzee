export const NOTIFICATION_TYPES = {
  VERIFICATION_SUBMITTED: "verification_submitted",
  VERIFICATION_APPROVED: "verification_approved",
  VERIFICATION_REJECTED: "verification_rejected",
  REUPLOAD_REQUIRED: "reupload_required",
  PROVIDER_LICENSE_SUBMITTED: "provider_license_submitted",
  PROVIDER_LICENSE_APPROVED: "provider_license_approved",
  PROVIDER_LICENSE_REJECTED: "provider_license_rejected",
  ADMIN_REVIEW_REQUIRED: "admin_review_required",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export const NOTIFICATION_CONTENT = {
  USER_VERIFICATION_SUBMITTED: {
    TITLE: "Verification submitted",
    MESSAGE: "Your identity verification was submitted for review.",
  },
  USER_VERIFICATION_APPROVED: {
    TITLE: "Identity approved",
    MESSAGE: "Your identity verification has been approved.",
  },
  USER_VERIFICATION_REJECTED: {
    TITLE: "Identity rejected",
  },
  PROVIDER_LICENSE_SUBMITTED: {
    TITLE: "License submitted",
    MESSAGE: "Your provider license was submitted for review.",
  },
  PROVIDER_LICENSE_APPROVED: {
    TITLE: "License approved",
    MESSAGE: "Your provider license verification has been approved.",
  },
  PROVIDER_LICENSE_REJECTED: {
    TITLE: "License rejected",
  },
  ADMIN_USER_VERIFICATION: {
    TITLE: "New user verification",
    MESSAGE: "A user identity verification is waiting for review.",
  },
  ADMIN_PROVIDER_VERIFICATION: {
    TITLE: "New provider license",
    MESSAGE: "A provider license verification is waiting for review.",
  },
} as const;

export const NOTIFICATION_TYPES = {
  VERIFICATION_SUBMITTED: "verification_submitted",
  VERIFICATION_APPROVED: "verification_approved",
  VERIFICATION_REJECTED: "verification_rejected",
  REUPLOAD_REQUIRED: "reupload_required",
  PROVIDER_LICENSE_SUBMITTED: "provider_license_submitted",
  PROVIDER_LICENSE_APPROVED: "provider_license_approved",
  PROVIDER_LICENSE_REJECTED: "provider_license_rejected",
  PROVIDER_COMMERCE_APPROVED: "provider_commerce_approved",
  PROVIDER_COMMERCE_REJECTED: "provider_commerce_rejected",
  PROVIDER_COMMERCE_FROZEN: "provider_commerce_frozen",
  PROVIDER_COMMERCE_RESUMED: "provider_commerce_resumed",
  PROVIDER_COMMISSION_UPDATED: "provider_commission_updated",
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
  PROVIDER_COMMERCE_APPROVED: {
    TITLE: "Commerce approved",
    MESSAGE: "Congratulations. Your provider account is now approved for selling products.",
  },
  PROVIDER_COMMERCE_REJECTED: {
    TITLE: "Commerce rejected",
  },
  PROVIDER_COMMERCE_FROZEN: {
    TITLE: "Commerce frozen",
    MESSAGE: "Your provider commerce access has been temporarily disabled.",
  },
  PROVIDER_COMMERCE_RESUMED: {
    TITLE: "Commerce resumed",
    MESSAGE: "Your provider commerce access has been resumed.",
  },
  PROVIDER_COMMISSION_UPDATED: {
    TITLE: "Commission updated",
    MESSAGE: "Your provider commission percentage has been updated.",
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

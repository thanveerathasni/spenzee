export const COMMERCE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  FROZEN: "FROZEN",
} as const;

export type CommerceStatus =
  (typeof COMMERCE_STATUS)[keyof typeof COMMERCE_STATUS];

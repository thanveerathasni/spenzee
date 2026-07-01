export type ProviderStatus =
  | "pending"
  | "active"
  | "suspended"
  | "blocked"
  | "rejected";

export type CommerceStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "FROZEN";

export interface AdminProvider {
  id: string;
  brandName: string;
  companyName?: string;
  email: string;
  phone?: string;
  gstNumber?: string;
  licenseNumber?: string;
  primaryCategory: string;
  websiteUrl?: string;
  socialLinks?: string[];
  description?: string;
  profileImage?: string;
  status: ProviderStatus;
  commerceStatus: CommerceStatus;
  commerceEnabled: boolean;
  commerceEnabledAt?: string;
  commerceApprovedBy?: string;
  commerceRejectedReason?: string;
  commissionPercentage: number;
  isCommerceFrozen: boolean;
  createdAt: string;
  updatedAt: string;
  hasAcceptedTerms: boolean;
}

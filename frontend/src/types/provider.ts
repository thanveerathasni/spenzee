export type ProviderStatus =
  | "pending"
  | "active"
  | "suspended"
  | "blocked"
  | "rejected";

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
  createdAt: string;
  updatedAt: string;
  hasAcceptedTerms: boolean;
}

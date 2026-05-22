import { ProviderStatus } from "../../../models/Provider.model";

export interface ProviderDTO {
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
  createdAt: Date;
  updatedAt: Date;
  hasAcceptedTerms: boolean;
}

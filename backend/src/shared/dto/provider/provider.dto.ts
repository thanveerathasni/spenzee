import { ProviderStatus } from "../../../models/Provider.model";
import { CommerceStatus } from "../../constants/commerce";

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
  commerceStatus: CommerceStatus;
  commerceEnabled: boolean;
  commerceEnabledAt?: Date;
  commerceApprovedBy?: string;
  commerceRejectedReason?: string;
  commissionPercentage: number;
  isCommerceFrozen: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasAcceptedTerms: boolean;
}

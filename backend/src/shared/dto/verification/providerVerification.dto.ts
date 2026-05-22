import {
  ProviderLicenseType,
  VerificationStatus,
} from "../../constants/verification";

export interface ProviderVerificationDTO {
  id: string;
  providerId: string;
  licenseType: ProviderLicenseType;
  documentUrl: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

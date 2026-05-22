export type VerificationStatus = "pending" | "approved" | "rejected";
export type UserDocumentType =
  | "aadhaar"
  | "passport"
  | "driving_license"
  | "national_id";
export type ProviderLicenseType =
  | "trade_license"
  | "gst_certificate"
  | "business_registration";

export interface UserVerification {
  id: string;
  userId: string;
  documentType: UserDocumentType;
  frontDocumentUrl: string;
  backDocumentUrl?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderVerification {
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

import {
  UserDocumentType,
  VerificationStatus,
} from "../../constants/verification";

export interface UserVerificationDTO {
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

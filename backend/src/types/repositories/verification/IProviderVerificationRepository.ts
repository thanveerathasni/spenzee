import { Types } from "mongoose";
import { IProviderVerification } from "../../../models/ProviderVerification.model";
import {
  ProviderLicenseType,
  VerificationStatus,
} from "../../../shared/constants/verification";

export interface CreateProviderVerificationData {
  providerId: Types.ObjectId;
  licenseType: ProviderLicenseType;
  documentUrl: string;
}

export interface IProviderVerificationRepository {
  create(data: CreateProviderVerificationData): Promise<IProviderVerification>;
  findLatestByProviderId(providerId: string): Promise<IProviderVerification | null>;
  findPendingByProviderId(providerId: string): Promise<IProviderVerification | null>;
  findById(id: string): Promise<IProviderVerification | null>;
  findAll(
    status: VerificationStatus | "",
    search: string,
  ): Promise<IProviderVerification[]>;
  updateReview(
    id: string,
    status: VerificationStatus,
    reviewedBy: string,
    rejectionReason?: string,
  ): Promise<IProviderVerification | null>;
}

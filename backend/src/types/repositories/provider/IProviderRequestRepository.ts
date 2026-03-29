import { IProviderRequest } from "../../../models/ProviderRequest.model";
import { ProviderRequestStatus } from "../../../shared/constants/providerRequestStatus";

export interface CreateProviderRequestDTO {
  brandName: string;
  websiteUrl: string;
  primaryCategory: string;
  contactEmail: string;
  description: string;
}

export interface IProviderRequestRepository {
  create(data: CreateProviderRequestDTO): Promise<IProviderRequest>;

  findById(id: string): Promise<IProviderRequest | null>;

  findAll(): Promise<IProviderRequest[]>;

  findByStatus(status: ProviderRequestStatus): Promise<IProviderRequest[]>;

  updateStatus(
    id: string,
    status: ProviderRequestStatus,
    reviewedBy: string,
    rejectionReason?: string,
  ): Promise<IProviderRequest | null>;
}
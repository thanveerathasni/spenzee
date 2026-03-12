import {
  IProviderRequest,
  ProviderRequestStatus
} from "../../../models/ProviderRequest.model";

export interface CreateProviderRequestData {
  brandName: string;
  websiteUrl: string;
  primaryCategory: string;
  contactEmail: string;
  description: string;
}

export interface IProviderRequestRepository {

  create(data: CreateProviderRequestData): Promise<IProviderRequest>;

  findById(id: string): Promise<IProviderRequest | null>;

  findAll(): Promise<IProviderRequest[]>;

  findByStatus(
    status: ProviderRequestStatus
  ): Promise<IProviderRequest[]>;

  updateStatus(
    id: string,
    status: ProviderRequestStatus,
    reviewedBy: string,
    rejectionReason?: string
  ): Promise<IProviderRequest | null>;
}
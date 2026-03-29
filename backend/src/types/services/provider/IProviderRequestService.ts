import { ProviderRequestStatus } from "../../../shared/constants/providerRequestStatus";

export interface CreateProviderRequestDTO {
  brandName: string;
  websiteUrl: string;
  primaryCategory: string;
  contactEmail: string;
  description: string;
}

export interface ProviderRequestDTO {
  id: string;
  brandName: string;
  websiteUrl: string;
  primaryCategory: string;
  contactEmail: string;
  description: string;
  status: ProviderRequestStatus;
  rejectionReason?: string;
}

export interface IProviderRequestService {
  createRequest(data: CreateProviderRequestDTO): Promise<ProviderRequestDTO>;

getAllRequests(): Promise<ProviderRequestDTO[]>;
  getRequestsByStatus(status: ProviderRequestStatus): Promise<ProviderRequestDTO[]>;

  reviewRequest(
    requestId: string,
    adminId: string,
    status: ProviderRequestStatus,
    rejectionReason?: string,
  ): Promise<ProviderRequestDTO>;
}

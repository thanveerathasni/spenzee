import { IProviderRequest, ProviderRequestStatus } from "../../../models/ProviderRequest.model";

export interface CreateProviderRequestDTO {
  brandName: string;
  websiteUrl: string;
  primaryCategory: string;
  contactEmail: string;
  description: string;
}

export interface IProviderRequestService {
  createRequest(data: CreateProviderRequestDTO): Promise<IProviderRequest>;

  getAllRequests(): Promise<IProviderRequest[]>;

  getRequestsByStatus(
    status: ProviderRequestStatus
  ): Promise<IProviderRequest[]>;

  reviewRequest(
    requestId: string,
    adminId: string,
    status: ProviderRequestStatus,
    rejectionReason?: string
  ): Promise<IProviderRequest>;
}
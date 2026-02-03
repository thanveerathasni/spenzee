import { IProviderRequest } from '../../../models/ProviderRequest.model';
import { ProviderRequestStatus } from '../../../models/ProviderRequest.model';

export interface IProviderRequestService {
  createRequest(
    data: {
      brandName: string;
      websiteUrl: string;
      primaryCategory: string;
      contactEmail: string;
      description: string;
    }
  ): Promise<IProviderRequest>;

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

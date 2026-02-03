import { inject, injectable } from 'inversify';

import {
  IProviderRequest,
  ProviderRequestStatus,
} from '../../../models/ProviderRequest.model';

import { IProviderRequestRepository } from '../../../types/repositories/provider/IProviderRequestRepository';
import { IProviderRequestService } from '../../../types/services/provider/IProviderRequestService';
import { TYPES } from '../../../di/types';

@injectable()
export class ProviderRequestService
  implements IProviderRequestService
{
  constructor(
    @inject(TYPES.ProviderRequestRepository)
    private readonly providerRequestRepository: IProviderRequestRepository
  ) {}

  async createRequest(
    data: {
      brandName: string;
      websiteUrl: string;
      primaryCategory: string;
      contactEmail: string;
      description: string;
    }
  ): Promise<IProviderRequest> {
    return await this.providerRequestRepository.create(data as any);
  }

  async getAllRequests(): Promise<IProviderRequest[]> {
    return await this.providerRequestRepository.findAll();
  }

  async getRequestsByStatus(
    status: ProviderRequestStatus
  ): Promise<IProviderRequest[]> {
    return await this.providerRequestRepository.findByStatus(status);
  }

  async reviewRequest(
    requestId: string,
    adminId: string,
    status: ProviderRequestStatus,
    rejectionReason?: string
  ): Promise<IProviderRequest> {
    if (
      status === ProviderRequestStatus.REJECTED &&
      !rejectionReason
    ) {
      throw new Error('Rejection reason is required');
    }

    const updatedRequest =
      await this.providerRequestRepository.updateStatus(
        requestId,
        status,
        adminId,
        rejectionReason
      );

    if (!updatedRequest) {
      throw new Error('Provider request not found');
    }

    return updatedRequest;
  }
}

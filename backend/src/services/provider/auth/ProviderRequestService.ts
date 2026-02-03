import { inject, injectable } from "inversify";

import {
  IProviderRequest,
  ProviderRequestStatus,
} from "../../../models/ProviderRequest.model";

import { IProviderRequestRepository } from "../../../types/repositories/provider/IProviderRequestRepository";
import { IProviderRequestService } from "../../../types/services/provider/IProviderRequestService";
import { IProviderService } from "../../../types/services/provider/IProviderService";
import { TYPES } from "../../../di/types";

@injectable()
export class ProviderRequestService
  implements IProviderRequestService
{
  constructor(
    @inject(TYPES.ProviderRequestRepository)
    private readonly providerRequestRepository: IProviderRequestRepository,

    @inject(TYPES.ProviderService)
    private readonly providerService: IProviderService
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
    const request =
      await this.providerRequestRepository.findById(requestId);

    if (!request) {
      throw new Error("Provider request not found");
    }

    // prevent double review
    if (request.status !== ProviderRequestStatus.PENDING) {
      throw new Error("Provider request already reviewed");
    }

    // rejection flow
    if (status === ProviderRequestStatus.REJECTED) {
      const rejectedRequest =
        await this.providerRequestRepository.updateStatus(
          requestId,
          status,
          adminId,
          rejectionReason
        );

      if (!rejectedRequest) {
        throw new Error("Failed to reject provider request");
      }

      return rejectedRequest;
    }

    // approval flow
    if (status === ProviderRequestStatus.APPROVED) {
      // create Provider entity
      await this.providerService.createProvider({
        brandName: request.brandName,
        email: request.contactEmail,
        primaryCategory: request.primaryCategory,
        websiteUrl: request.websiteUrl,
        description: request.description,
      });

      const approvedRequest =
        await this.providerRequestRepository.updateStatus(
          requestId,
          status,
          adminId
        );

      if (!approvedRequest) {
        throw new Error("Failed to approve provider request");
      }

      return approvedRequest;
    }

    throw new Error("Invalid provider request status");
  }
}

import crypto from "crypto";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../di/types";

import { LOG_MESSAGES } from "../../../shared/constants/logMessages";
import { ProviderRequestStatus } from "../../../shared/constants/providerRequestStatus";
import { ProviderStatus } from "../../../models/Provider.model";
import { logger } from "../../../shared/logger/logger";
import { ProviderRequestMapper } from "../../../shared/mapper/provider/ProviderRequestMapper";

import { IProviderPasswordSetupTokenRepository } from "../../../types/repositories/provider/IProviderPasswordSetupTokenRepository";
import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";
import { IProviderRequestRepository } from "../../../types/repositories/provider/IProviderRequestRepository";
import { IMailService } from "../../../types/services/IMailService";

@injectable()
export class ProviderRequestService {
  constructor(
    @inject(TYPES.ProviderRequestRepository)
    private readonly _repo: IProviderRequestRepository,

    @inject(TYPES.ProviderRepository)
    private readonly _providerRepo: IProviderRepository,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly _tokenRepo: IProviderPasswordSetupTokenRepository,

    @inject(TYPES.MailService)
    private readonly _mailService: IMailService
  ) {}

  async createRequest(data: {
    brandName: string;
    websiteUrl: string;
    primaryCategory: string;
    contactEmail: string;
    description: string;
  }) {
    logger.info(LOG_MESSAGES.PROVIDER.REQUEST_SUBMITTED);

    const request = await this._repo.create({
      ...data,
      status: ProviderRequestStatus.PENDING,
    });

    return ProviderRequestMapper.toDTO(request);
  }

  async getAllRequests() {
    const requests = await this._repo.findAll();
    return requests.map(ProviderRequestMapper.toDTO);
  }

  async reviewRequest(
    requestId: string,
    adminId: string,
    status: ProviderRequestStatus
  ) {
    logger.info("Provider request reviewed", { requestId, status });

    const request = await this._repo.updateStatus(
      requestId,
      status,
      adminId
    );

    if (!request) {
      throw new Error("Request not found");
    }

    if (status === ProviderRequestStatus.APPROVED) {
      await this._providerRepo.create({
        brandName: request.brandName,
        email: request.contactEmail,
        primaryCategory: request.primaryCategory,

        description: request.description,
        websiteUrl: request.websiteUrl,

        status: ProviderStatus.ACTIVE,
      });
    }

    return ProviderRequestMapper.toDTO(request);
  }
}
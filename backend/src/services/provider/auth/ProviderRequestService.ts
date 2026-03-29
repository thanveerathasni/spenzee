import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";

import { logger } from "../../../shared/logger/logger";
import { ProviderRequestMapper } from "../../../shared/mapper/provider/ProviderRequestMapper";
import { IProviderPasswordSetupTokenRepository } from "../../../types/repositories/provider/IProviderPasswordSetupTokenRepository";

import { IProviderRequestRepository } from "../../../types/repositories/provider/IProviderRequestRepository";

import { IProviderRequestService } from "../../../types/services/provider/IProviderRequestService";
import { IProviderService } from "../../../types/services/provider/IProviderService";


@injectable()
export class ProviderRequestService implements IProviderRequestService {
  constructor(
    @inject(TYPES.ProviderRequestRepository)
    private readonly _repo: IProviderRequestRepository,

    @inject(TYPES.ProviderService)
    private readonly _providerService: IProviderService,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly _tokenRepo: IProviderPasswordSetupTokenRepository,
  ) {}

  async createRequest(data: any) {
    logger.info("Create provider request");

    const request = await this._repo.create(data);
    return ProviderRequestMapper.toDTO(request);
  }

  async getAllRequests() {
    const requests = await this._repo.findAll();
    return requests.map(ProviderRequestMapper.toDTO);
  }

  async getRequestsByStatus(status: any) {
    const requests = await this._repo.findByStatus(status);
    return requests.map(ProviderRequestMapper.toDTO);
  }

  async reviewRequest(requestId: string, adminId: string, status: any) {
    logger.info("Review provider request", { requestId });

    const updated = await this._repo.updateStatus(requestId, status, adminId);
    return ProviderRequestMapper.toDTO(updated!);
  }
}
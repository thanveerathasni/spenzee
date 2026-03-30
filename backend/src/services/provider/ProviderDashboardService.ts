import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ProviderDashboardDTO } from "../../shared/dto/provider/providerDashboard";

import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";

@injectable()
export class ProviderDashboardService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _repo: IProviderRepository
  ) {}

 async getDashboard(providerId: string): Promise<ProviderDashboardDTO | null> {
  return this._repo.getDashboardStats(providerId);
}
}
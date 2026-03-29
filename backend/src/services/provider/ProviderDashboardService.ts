import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";

@injectable()
export class ProviderDashboardService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _repo: IProviderRepository
  ) {}

  async getDashboard(providerId: string) {
    return this._repo.getDashboardStats(providerId);
  }
}
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";

@injectable()
export class ProviderDashboardService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly providerRepository: IProviderRepository
  ) {}

  async getDashboard(providerId: string) {
    const provider =
      await this.providerRepository.findById(providerId);

    if (!provider) {
      throw new Error("Provider not found");
    }

    return {
      id: provider._id.toString(),
      brandName: provider.brandName,
      email: provider.email,
      primaryCategory: provider.primaryCategory,
      status: provider.status,
      createdAt: provider.createdAt,
    };
  }
}

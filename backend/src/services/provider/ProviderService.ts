import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

import { IProviderService } from "../../types/services/provider/IProviderService";
import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";

import { IProvider } from "../../models/Provider.model";
import { ProviderDashboardDTO } from "../../shared/dto/provider/providerDashboard";
import { PROVIDER_ERROR_MESSAGES } from "../../shared/constants/provider";

@injectable()
export class ProviderService implements IProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly providerRepository: IProviderRepository
  ) {}

  async createProvider(data: {
    brandName: string;
    email: string;
    primaryCategory: string;
    websiteUrl?: string;
    description?: string;
  }): Promise<IProvider> {

    const existingProvider =
      await this.providerRepository.findByEmail(data.email);

    if (existingProvider) {
throw new Error(PROVIDER_ERROR_MESSAGES.NOT_FOUND);    }

    return this.providerRepository.create(data);
  }

  async getDashboard(providerId: string): Promise<ProviderDashboardDTO> {

    const stats = await this.providerRepository.getDashboardStats(providerId);

    return {
      totalProducts: stats.totalProducts,
      totalSales: stats.totalSales,
      revenue: stats.revenue
    };
  }
}
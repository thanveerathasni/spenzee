import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

import { PROVIDER_ERROR_MESSAGES } from "../../shared/constants/provider";
import { ProviderDashboardDTO } from "../../shared/dto/provider/providerDashboard";
import { ProviderMapper } from "../../shared/mapper/provider/ProviderMapper";

import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";
import { IProviderService } from "../../types/services/provider/IProviderService";

import { ProviderDTO } from "../../shared/dto/provider/provider.dto";

@injectable()
export class ProviderService implements IProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,
  ) {}

  async createProvider(data: {
    brandName: string;
    email: string;
    primaryCategory: string;
    websiteUrl?: string;
    description?: string;
  }): Promise<ProviderDTO> {
    const existing = await this._providerRepository.findByEmail(data.email);

    if (existing) {
      throw new Error(PROVIDER_ERROR_MESSAGES.ALREADY_EXISTS);
    }

    const provider = await this._providerRepository.create(data);

    return ProviderMapper.toDTO(provider);
  }

  async getDashboard(providerId: string): Promise<ProviderDashboardDTO> {
    const stats = await this._providerRepository.getDashboardStats(providerId);

    return {
      totalProducts: stats.totalProducts,
      totalSales: stats.totalSales,
      revenue: stats.revenue,
    };
  }
}
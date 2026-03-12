import { injectable } from "inversify";
import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";

import { IProvider, ProviderModel, ProviderStatus } from "../../../models/Provider.model";

@injectable()
export class ProviderRepository implements IProviderRepository {
  async findByEmail(email: string): Promise<IProvider | null> {
    return ProviderModel.findOne({ email });
  }

  async findById(id: string): Promise<IProvider | null> {
    return ProviderModel.findById(id);
  }

  async create(data: {
    brandName: string;
    email: string;
    primaryCategory: string;
    websiteUrl?: string;
    description?: string;
  }): Promise<IProvider> {
    const provider = new ProviderModel(data);
    return provider.save();
  }

  async updatePassword(providerId: string, hashedPassword: string): Promise<void> {
    await ProviderModel.findByIdAndUpdate(providerId, {
      password: hashedPassword,
    });
  }

  async updateStatus(providerId: string, status: ProviderStatus): Promise<void> {
    await ProviderModel.findByIdAndUpdate(providerId, {
      status,
    });
  }

  async getDashboardStats(_providerId: string): Promise<{
    totalProducts: number;
    totalSales: number;
    revenue: number;
  }> {
    // Temporary placeholder until product/order modules exist

    return {
      totalProducts: 0,
      totalSales: 0,
      revenue: 0,
    };
  }
}

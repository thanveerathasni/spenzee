import { injectable } from "inversify";
import { Types } from "mongoose";

import { ProviderModel, IProvider,ProviderStatus } from "../../../models/Provider.model";
import { BaseRepository } from "../../../shared/base/BaseRepository";
import { ProviderDashboardDTO } from "../../../shared/dto/provider/providerDashboard";
import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";
@injectable()
export class ProviderRepository
  extends BaseRepository<IProvider>
  implements IProviderRepository
{
  constructor() {
    super(ProviderModel);
  }

  async findByEmail(email: string): Promise<IProvider | null> {
    return this.model.findOne({ email }).exec();
  }
async findAll(status?: ProviderStatus) {
  const filter = status ? { status } : {};
  return ProviderModel.find(filter).exec();
}
  async updatePassword(providerId: string, password: string): Promise<void> {
    if (!Types.ObjectId.isValid(providerId)) return;

    await this.model.findByIdAndUpdate(providerId, { password }).exec();
  }

  async updateById(providerId: string, data: Partial<IProvider>): Promise<IProvider | null> {
    if (!Types.ObjectId.isValid(providerId)) return null;

    return this.model.findByIdAndUpdate(providerId, data, { new: true }).exec();
  }

  async updateStatus(providerId: string, status: string): Promise<void> {
    if (!Types.ObjectId.isValid(providerId)) return;

    await this.model.findByIdAndUpdate(providerId, { status }).exec();
  }

async getDashboardStats(providerId: string): Promise<ProviderDashboardDTO | null> {
  if (!Types.ObjectId.isValid(providerId)) return null;

  return {
    totalProducts: 0,
    totalSales: 0,
    revenue: 0,
  };
}
}
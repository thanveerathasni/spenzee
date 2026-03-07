import { IProvider, ProviderStatus } from "../../../models/Provider.model";

export interface IProviderRepository {
  findByEmail(email: string): Promise<IProvider | null>;

  findById(id: string): Promise<IProvider | null>;
getDashboardStats(providerId: string): Promise<{
    totalProducts: number;
    totalSales: number;
    revenue: number;
  }>;
  create(data: {
    brandName: string;
    email: string;
    primaryCategory: string;
    websiteUrl?: string;
    description?: string;
  }): Promise<IProvider>;

  updatePassword(
    providerId: string,
    hashedPassword: string
  ): Promise<void>;

  updateStatus(
    providerId: string,
    status: ProviderStatus
  ): Promise<void>;
}
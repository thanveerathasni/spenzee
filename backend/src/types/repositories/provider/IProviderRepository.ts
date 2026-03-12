import { IProvider, ProviderStatus } from "../../../models/Provider.model";

export interface CreateProviderData {
  brandName: string;
  email: string;
  primaryCategory: string;
  websiteUrl?: string;
  description?: string;
}

export interface ProviderDashboardStats {
  totalProducts: number;
  totalSales: number;
  revenue: number;
}

export interface IProviderRepository {
  findByEmail(email: string): Promise<IProvider | null>;

  findById(id: string): Promise<IProvider | null>;

  create(data: CreateProviderData): Promise<IProvider>;

  updatePassword(providerId: string, hashedPassword: string): Promise<void>;

  updateStatus(providerId: string, status: ProviderStatus): Promise<void>;

  getDashboardStats(providerId: string): Promise<ProviderDashboardStats>;
}
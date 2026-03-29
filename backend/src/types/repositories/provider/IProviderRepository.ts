import { IProvider } from "../../../models/Provider.model";

export interface IProviderRepository {
  create(data: Partial<IProvider>): Promise<IProvider>;

  findById(id: string): Promise<IProvider | null>;

  findByEmail(email: string): Promise<IProvider | null>;

  updatePassword(providerId: string, password: string): Promise<void>;

  updateStatus(providerId: string, status: string): Promise<void>;

  getDashboardStats(providerId: string): Promise<any>;
}
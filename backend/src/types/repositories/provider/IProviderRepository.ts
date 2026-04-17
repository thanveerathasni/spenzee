import { IProvider } from "../../../models/Provider.model";
import { ProviderStatus } from "../../../models/Provider.model";
import { ProviderDashboardDTO } from "../../../shared/dto/provider/providerDashboard";
export interface IProviderRepository {
 findById(id: string): Promise<IProvider | null>;

  create(data: Partial<IProvider>): Promise<IProvider>;

  updateStatus(
    id: string,
    status: ProviderStatus
  ): Promise<void>;

  findAll(status?: ProviderStatus): Promise<IProvider[]>;
  findByEmail(email: string): Promise<IProvider | null>;

  updatePassword(providerId: string, password: string): Promise<void>;

  updateById(providerId: string, data: Partial<IProvider>): Promise<IProvider | null>;

  updateStatus(providerId: string, status: string): Promise<void>;

  getDashboardStats(providerId: string): Promise<ProviderDashboardDTO | null>;
}
import {
  IProvider,
  ProviderStatus,
} from "../../../models/Provider.model";

import { ProviderDashboardDTO } from "../../../shared/dto/provider/providerDashboard";

export interface IProviderRepository {
  findById(
    id: string,
  ): Promise<IProvider | null>;

  create(
    data: Partial<IProvider>,
  ): Promise<IProvider>;

  findAll(
    status?: ProviderStatus,
  ): Promise<IProvider[]>;

  findByEmail(
    email: string,
  ): Promise<IProvider | null>;

  findByIdWithPassword(
    providerId: string,
  ): Promise<IProvider | null>;

  updatePassword(
    providerId: string,
    password: string,
  ): Promise<void>;

  updateById(
    providerId: string,
    data: Partial<IProvider>,
  ): Promise<IProvider | null>;

  updateStatus(
    providerId: string,
    status: ProviderStatus,
  ): Promise<void>;

  getDashboardStats(
    providerId: string,
  ): Promise<ProviderDashboardDTO | null>;

  findAllPaginated(
    status: ProviderStatus | "",
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    providers: IProvider[];

    total: number;
  }>;
}
import { ProviderDashboardDTO } from "../../../shared/dto/provider/providerDashboard";
import { ProviderDTO } from "../../../shared/dto/provider/provider.dto";

export interface CreateProviderDTO {
  brandName: string;
  email: string;
  primaryCategory: string;
  websiteUrl?: string;
  description?: string;
}

export interface IProviderService {
  createProvider(data: CreateProviderDTO): Promise<ProviderDTO>;

  getDashboard(providerId: string): Promise<ProviderDashboardDTO>;
}

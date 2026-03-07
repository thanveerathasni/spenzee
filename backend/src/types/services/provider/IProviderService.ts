import { IProvider } from "../../../models/Provider.model";
import { ProviderDashboardDTO } from "../../../shared/dto/providerDashboard";

export interface CreateProviderDTO {
  brandName: string;
  email: string;
  primaryCategory: string;
  websiteUrl?: string;
  description?: string;
}

export interface IProviderService {
  createProvider(data: CreateProviderDTO): Promise<IProvider>;
  getDashboard(providerId: string): Promise<ProviderDashboardDTO>;

}
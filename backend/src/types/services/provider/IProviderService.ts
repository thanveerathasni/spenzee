import { IProvider } from "../../../models/Provider.model";

export interface IProviderService {
  createProvider(data: {
    brandName: string;
    email: string;
    primaryCategory: string;
    websiteUrl?: string;
    description?: string;
  }): Promise<IProvider>;
}

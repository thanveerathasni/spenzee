import { IProvider } from "../../../models/Provider.model";

export interface IProviderRepository {
  create(data: {
    brandName: string;
    email: string;
    primaryCategory: string;
    websiteUrl?: string;
    description?: string;
  }): Promise<IProvider>;

  findByEmail(email: string): Promise<IProvider | null>;

  findById(id: string): Promise<IProvider | null>;
}

import { IProvider } from "../../../models/Provider.model";
import { ProviderDTO } from "../../../shared/dto/provider/provider.dto";

export interface IProviderService {
  createProvider(data: Partial<IProvider>): Promise<ProviderDTO>;
  updatePassword(providerId: string, password: string): Promise<void>;
}
import { ProviderDTO } from "../../../shared/dto/provider/provider.dto";

export interface IProviderService {
  createProvider(data: any): Promise<ProviderDTO>;
  updatePassword(providerId: string, password: string): Promise<void>;
}
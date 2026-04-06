import { ProviderDTO } from "../../../shared/dto/provider/provider.dto";

export interface ProviderAuthResponse {
  accessToken: string;
  provider: ProviderDTO;
}

export interface IProviderAuthService {
  login(email: string, password: string): Promise<ProviderAuthResponse>;
  setupPassword(token: string, password: string): Promise<void>;
}
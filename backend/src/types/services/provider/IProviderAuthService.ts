import { ProviderDTO } from "../../../shared/dto/provider/provider.dto";

export interface ProviderAuthResponse {
  accessToken: string;
  provider: ProviderDTO;
}

export interface IProviderAuthService {
  login(email: string, password: string): Promise<ProviderAuthResponse>;
  setupPassword(token: string, password: string): Promise<void>;
  forgotPassword(
    email: string
  ): Promise<void>;
  resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<void>;
  refresh(
  refreshToken: string,
): Promise<{
  accessToken: string;

  provider: unknown;
}>;
  changePassword(providerId: string, oldPassword: string, newPassword: string): Promise<void>;
}
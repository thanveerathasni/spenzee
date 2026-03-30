export interface ProviderAuthResponse {
  accessToken: string;
  provider: any;
}

export interface IProviderAuthService {
  login(email: string, password: string): Promise<ProviderAuthResponse>;
  setupPassword(token: string, password: string): Promise<void>;
}
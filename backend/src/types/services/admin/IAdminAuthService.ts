export interface AdminAuthResponse {
  accessToken: string;
  admin: {
    id: string;
    email: string;
  };
}

export interface IAdminAuthService {
  login(email: string, password: string): Promise<AdminAuthResponse>;
}

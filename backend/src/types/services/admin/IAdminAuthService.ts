import { IAdmin } from "../../../models/Admin.model";

export interface AdminAuthResponse {
  accessToken: string;
  refreshToken: string;
  admin: {
    id: string;
    email: string;
  };
}

export interface IAdminAuthService {
  login(email: string, password: string): Promise<AdminAuthResponse>;
  logout(refreshToken: string): Promise<void>;
refresh(refreshToken: string): Promise<{
  accessToken: string;
  admin: {
    id: string;
    email: string;
  };
}>;

}

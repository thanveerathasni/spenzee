import { AdminDTO } from "../../../shared/mapper/admin/AdminMapper";

export interface AdminAuthResponse {
  accessToken: string;

  refreshToken?: string;

  admin: AdminDTO;
}

export interface IAdminAuthService {
  login(
    email: string,
    password: string,
  ): Promise<AdminAuthResponse>;

  refresh(
    refreshToken: string,
  ): Promise<{
    accessToken: string;

    admin: AdminDTO;
  }>;
}
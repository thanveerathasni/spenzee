import { AdminDTO } from "../../../shared/mapper/admin/AdminMapper";

export interface AdminAuthResponse {
  accessToken: string;
  admin: AdminDTO;
}

export interface IAdminAuthService {
  login(email: string, password: string): Promise<AdminAuthResponse>;
}
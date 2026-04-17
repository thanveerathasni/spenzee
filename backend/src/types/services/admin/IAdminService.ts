import { IProvider, ProviderStatus } from "../../../models/Provider.model";
import { IUser } from "../../../models/User.model";
import { ProviderRequestStatus } from "../../../shared/constants/providerRequestStatus";
import { AdminDashboardDTO } from "../../../shared/dto/admin/adminDashboard.dto";

export interface IAdminService {
  getDashboard(adminId: string): Promise<AdminDashboardDTO>;

  getUsers(
    page: number,
    limit: number,
    search: string
  ): Promise<{
    users: IUser[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  getUserById(userId: string): Promise<IUser | null>;

  updateUserStatus(userId: string, isActive: boolean): Promise<void>;

getProviders(
  status: string,
  page: number,
  limit: number,
  search: string
): Promise<{
  providers: any[];
  total: number;
}>;
  updateProviderStatus(providerId: string, status: ProviderStatus): Promise<void>;

  getProviderRequests(
    page: number,
    limit: number,
    search: string
  ): Promise<{
    requests: any[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  reviewProviderRequest(
    requestId: string,
    adminId: string,
    status: ProviderRequestStatus
  ): Promise<void>;
}
import { IProvider, ProviderStatus } from "../../../models/Provider.model";
import { IProviderRequest } from "../../../models/ProviderRequest.model";
import { IUser } from "../../../models/User.model";
import { CommerceStatus } from "../../../shared/constants/commerce";
import { ProviderRequestStatus } from "../../../shared/constants/providerRequestStatus";
import { AdminDashboardDTO } from "../../../shared/dto/admin/adminDashboard.dto";
import { ProviderDTO } from "../../../shared/dto/provider/provider.dto";

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
  status: ProviderStatus | "",
  page: number,
  limit: number,
  search: string
): Promise<{
  providers: IProvider[];
  total: number;
}>;

  getCommerceProviders(
    commerceStatus: CommerceStatus | "",
    page: number,
    limit: number,
    search: string
  ): Promise<{
    providers: IProvider[];
    total: number;
  }>;

  getProviderById(providerId: string): Promise<ProviderDTO>;

  updateProviderStatus(providerId: string, status: ProviderStatus): Promise<void>;

  approveProviderCommerce(
    providerId: string,
    adminId: string,
    commissionPercentage: number
  ): Promise<ProviderDTO>;

  rejectProviderCommerce(
    providerId: string,
    adminId: string,
    reason: string
  ): Promise<ProviderDTO>;

  freezeProviderCommerce(providerId: string, adminId: string): Promise<ProviderDTO>;

  resumeProviderCommerce(providerId: string, adminId: string): Promise<ProviderDTO>;

  updateProviderCommission(
    providerId: string,
    adminId: string,
    commissionPercentage: number
  ): Promise<ProviderDTO>;

  getProviderRequests(
    page: number,
    limit: number,
    search: string
  ): Promise<{
    requests: IProviderRequest[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  reviewProviderRequest(
    requestId: string,
    adminId: string,
    status: ProviderRequestStatus
  ): Promise<IProviderRequest>;
}

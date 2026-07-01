import { adminApi } from "./adminAxios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { AdminProvider, CommerceStatus, ProviderStatus } from "../../types/provider";

export const adminUserApi = {
  getUsers: async (page = 1, search = "") => {
    const res = await adminApi.get(
      `/admin/users?page=${page}&limit=10&search=${search}`
    );
    return res.data.data;
  },

  getUserById: async (id: string) => {
    const res = await adminApi.get(`/admin/users/${id}`);
    return res.data.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    await adminApi.patch(`/admin/users/${id}/status`, { isActive });
  },

  getProviderById: async (id: string): Promise<AdminProvider> => {
    const res = await adminApi.get(API_ROUTES.ADMIN.PROVIDER_DETAILS(id));
    return res.data.data;
  },

  updateProviderStatus: async (
    id: string,
    status: Exclude<ProviderStatus, "pending" | "rejected">,
  ): Promise<void> => {
    await adminApi.patch(`/admin/providers/${id}/status`, { status });
  },

  getCommerceProviders: async (
    status: CommerceStatus | "" = "",
    page = 1,
    search = "",
  ): Promise<{ providers: AdminProvider[]; total: number }> => {
    const res = await adminApi.get(API_ROUTES.ADMIN.PROVIDER_COMMERCE, {
      params: {
        status,
        page,
        limit: 10,
        search,
      },
    });
    return res.data.data;
  },

  approveProviderCommerce: async (
    id: string,
    commissionPercentage?: number,
  ): Promise<AdminProvider> => {
    const res = await adminApi.patch(API_ROUTES.ADMIN.PROVIDER_COMMERCE_APPROVE(id), {
      commissionPercentage,
    });
    return res.data.data;
  },

  rejectProviderCommerce: async (
    id: string,
    reason: string,
  ): Promise<AdminProvider> => {
    const res = await adminApi.patch(API_ROUTES.ADMIN.PROVIDER_COMMERCE_REJECT(id), {
      reason,
    });
    return res.data.data;
  },

  freezeProviderCommerce: async (id: string): Promise<AdminProvider> => {
    const res = await adminApi.patch(API_ROUTES.ADMIN.PROVIDER_COMMERCE_FREEZE(id));
    return res.data.data;
  },

  resumeProviderCommerce: async (id: string): Promise<AdminProvider> => {
    const res = await adminApi.patch(API_ROUTES.ADMIN.PROVIDER_COMMERCE_RESUME(id));
    return res.data.data;
  },

  updateProviderCommission: async (
    id: string,
    commissionPercentage: number,
  ): Promise<AdminProvider> => {
    const res = await adminApi.patch(API_ROUTES.ADMIN.PROVIDER_COMMISSION(id), {
      commissionPercentage,
    });
    return res.data.data;
  },
};

import { adminApi } from "./adminAxios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { AdminProvider, ProviderStatus } from "../../types/provider";

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
};

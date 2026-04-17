import { adminApi } from "./adminAxios";

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
};
import axios from "axios";
import { adminAuthStore } from "../../store/admin/adminAuth";

const API_URL = import.meta.env.VITE_API_URL;

export const adminAuthApi = {
  login: async (payload: { email: string; password: string }) => {
    const res = await axios.post(`${API_URL}/admin/auth/login`, payload);

    const data = res.data.data;

    adminAuthStore.setToken(data.accessToken);

    return data;
  },

  logout: () => {
    adminAuthStore.clearToken();
  },

  getDashboard: async (accessToken: string) => {
    const res = await axios.get(
      `${API_URL}/admin/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.data.data;
  },
};

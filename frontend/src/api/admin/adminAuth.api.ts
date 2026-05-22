import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const adminAuthApi = {
  login: async (payload: { email: string; password: string }) => {
    const res = await axios.post(`${API_URL}/admin/auth/login`, payload);
    return res.data.data;
  },

  logout: async () => {
    await axios.post(`${API_URL}/admin/auth/logout`);
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

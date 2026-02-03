import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  admin: {
    id: string;
    email: string;
  };
}

export const adminAuthApi = {
  login: async (
    payload: AdminLoginPayload
  ): Promise<AdminLoginResponse> => {
    const res = await axios.post(
      `${API_URL}/admin/auth/login`,
      payload
    );

    return res.data.data;
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

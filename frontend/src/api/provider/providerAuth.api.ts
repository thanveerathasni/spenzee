import { api } from "../axios";

export const providerAuthApi = {
  login: async (email: string, password: string) => {
    const res = await api.post("/provider/auth/login", { email, password });
    return res.data.data;
  },

  acceptTerms: async () => {
    await api.patch("/provider/accept-terms");
  },

  logout: async () => {
    await api.post("/auth/logout");
  },
};
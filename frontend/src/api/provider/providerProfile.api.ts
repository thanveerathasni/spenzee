import { api } from "../axios";

export const providerProfileApi = {
  getProfile: async () => {
    const res = await api.get("/provider/profile");
    return res.data.data;
  },

  updateProfile: async (data: {
    brandName: string;
    websiteUrl?: string;
    primaryCategory?: string;
    description?: string;
  }) => {
    const res = await api.patch("/provider/profile", data);
    return res.data.data;
  },
};
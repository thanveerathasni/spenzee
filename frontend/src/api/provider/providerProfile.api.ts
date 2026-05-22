import { api } from "../axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { AdminProvider } from "../../types/provider";

export interface ProviderProfileUpdatePayload {
  brandName: string;
  websiteUrl?: string;
  primaryCategory?: string;
  description?: string;
}

export interface ProviderPasswordChangePayload {
  oldPassword: string;
  newPassword: string;
}

export const providerProfileApi = {
  getProfile: async (): Promise<AdminProvider> => {
    const res = await api.get(API_ROUTES.PROVIDER.PROFILE);
    return res.data.data;
  },

  updateProfile: async (data: ProviderProfileUpdatePayload): Promise<AdminProvider> => {
    const res = await api.patch(API_ROUTES.PROVIDER.UPDATE_PROFILE, data);
    return res.data.data;
  },

  changePassword: async (data: ProviderPasswordChangePayload): Promise<void> => {
    await api.patch(API_ROUTES.PROVIDER.CHANGE_PASSWORD, data);
  },

  requestEmailChange: async (email: string): Promise<void> => {
    await api.post(API_ROUTES.PROVIDER.EMAIL_CHANGE_REQUEST, { email });
  },

  verifyEmailChange: async (email: string, otp: string): Promise<AdminProvider> => {
    const res = await api.post(API_ROUTES.PROVIDER.EMAIL_VERIFY, { email, otp });
    return res.data.data;
  },
};

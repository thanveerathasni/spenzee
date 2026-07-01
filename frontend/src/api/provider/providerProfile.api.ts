import { providerApi } from "./providerAxios";
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

export interface ProviderDashboardStats {
  totalProducts: number;
  totalSales: number;
  revenue: number;
}

export const providerProfileApi = {
  getDashboard: async (): Promise<ProviderDashboardStats> => {
    const res = await providerApi.get(API_ROUTES.PROVIDER.DASHBOARD);
    return res.data.data;
  },

  getCommerceStatus: async (): Promise<AdminProvider> => {
    const res = await providerApi.get(API_ROUTES.PROVIDER.COMMERCE_STATUS);
    return res.data.data;
  },

  getProfile: async (): Promise<AdminProvider> => {
    const res = await providerApi.get(API_ROUTES.PROVIDER.PROFILE);
    return res.data.data;
  },

  updateProfile: async (data: ProviderProfileUpdatePayload): Promise<AdminProvider> => {
    const res = await providerApi.patch(API_ROUTES.PROVIDER.PROFILE, data);
    return res.data.data;
  },

  changePassword: async (data: ProviderPasswordChangePayload): Promise<void> => {
    await providerApi.patch(API_ROUTES.PROVIDER.CHANGE_PASSWORD, data);
  },

  requestEmailChange: async (email: string): Promise<void> => {
    await providerApi.post(API_ROUTES.PROVIDER.EMAIL_CHANGE_REQUEST, { email });
  },

  verifyEmailChange: async (email: string, otp: string): Promise<AdminProvider> => {
    const res = await providerApi.post(API_ROUTES.PROVIDER.EMAIL_VERIFY, { email, otp });
    return res.data.data;
  },
};

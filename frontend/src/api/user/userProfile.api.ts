import { api } from "../axios";

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}

export interface AddressPayload {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export const userProfileApi = {
  getProfile: async () => {
    const res = await api.get("/user/profile");
    return res.data.data;
  },

  updateProfile: async (data: UpdateProfilePayload) => {
    const res = await api.patch("/user/profile", data);
    return res.data.data;
  },

  updateAddress: async (data: AddressPayload) => {
    const res = await api.patch("/user/profile", data);
    return res.data.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    await api.patch("/user/change-password", data);
  },
};
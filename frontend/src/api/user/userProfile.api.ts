import { api } from "../axios";

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
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

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.patch("/user/profile/image", formData);
    return res.data.data;
  },
};
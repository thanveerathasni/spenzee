import { api } from "../axios";

/* ---------- Types ---------- */

export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  profileImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  role: string;
  isVerified: boolean;
}

/* ---------- API ---------- */

export const userProfileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const res = await api.get("/user/profile");
    return res.data.data;
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const res = await api.patch("/user/profile", data);
    return res.data.data;
  },

  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.patch("/user/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  },
};
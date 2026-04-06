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

uploadImage: async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.patch("/user/profile/image", formData, {
   
  });



  return res.data.data;
},

sendEmailOtp: (data: { email: string }) =>
  api.post("/user/email/send-otp", data),

verifyEmailOtp: (data: { email: string; otp: string }) =>
  api.post("/user/email/verify-otp", data),

updateEmail: (data: { newEmail: string }) =>
  api.patch("/user/email/update", data),

sendPasswordOtp: () =>
  api.post("/user/password/send-otp"),

verifyPasswordOtp: (data: { otp: string }) =>
  api.post("/user/password/verify-otp", data),

updatePasswordNew: (data: { newPassword: string }) =>
  api.patch("/user/password/update", data),
  
};
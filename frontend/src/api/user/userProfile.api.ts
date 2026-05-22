import { api } from "../axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import { Address, User } from "../../types/user";

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  occupation?: string;
  bio?: string;
}

export interface AddressPayload extends Omit<Address, "id"> {
  fullName: string;
  phone: string;
  houseName: string;
  street: string;
  city: string;
  district: string;
  state: string;
  country: string;
  postalCode: string;
  addressType: "home" | "work" | "other";
}

export const userProfileApi = {
  getProfile: async (): Promise<User> => {
    const res = await api.get(API_ROUTES.USER.PROFILE);
    return res.data.data;
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<User> => {
    const res = await api.patch(API_ROUTES.USER.PROFILE, data); 
    return res.data.data;
  },

  requestEmailChange: async (newEmail: string): Promise<void> => {
    await api.post(API_ROUTES.USER.EMAIL_REQUEST, { newEmail });
  },

  confirmEmailChange: async (newEmail: string, otp: string): Promise<{ email: string }> => {
    const res = await api.post(API_ROUTES.USER.EMAIL_CONFIRM, { newEmail, otp });
    return res.data.data;
  },

  updatePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.patch(API_ROUTES.USER.CHANGE_PASSWORD_UPDATE, data);
  },

  getAddresses: async (): Promise<Address[]> => {
    const res = await api.get(API_ROUTES.USER.ADDRESSES);
    return res.data.data;
  },

  getPrimaryAddress: async (): Promise<Address | null> => {
    const res = await api.get(API_ROUTES.USER.PRIMARY_ADDRESS);
    return res.data.data;
  },

  addAddress: async (data: AddressPayload): Promise<Address> => {
    const res = await api.post(API_ROUTES.USER.ADDRESSES, data);
    return res.data.data;
  },

  updateAddress: async (id: string, data: Partial<AddressPayload>): Promise<Address> => {
    const res = await api.patch(API_ROUTES.USER.ADDRESS_DETAIL(id), data);
    return res.data.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(API_ROUTES.USER.ADDRESS_DETAIL(id));
  },

  setPrimaryAddress: async (id: string): Promise<Address> => {
    const res = await api.patch(API_ROUTES.USER.ADDRESS_PRIMARY(id));
    return res.data.data;
  },

  uploadImage: async (file: File): Promise<User> => {
    
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.patch(
      API_ROUTES.USER.PROFILE_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      }
    );

    return res.data.data;
  },

  removeImage: async (): Promise<User> => {
    const res = await api.delete(API_ROUTES.USER.PROFILE_IMAGE);
    return res.data.data;
  },
};

import { api } from "./axios";
import type { User } from "../store/auth/auth.types";

/* ---------- Types ---------- */

export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

/* ---------- API ---------- */

export const authApi = {
  signup: async (data: SignupRequest): Promise<void> => {
    await api.post("/auth/signup", data);
  },


  login: async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", data);

  return {
    accessToken: res.data.data.accessToken,
    user: res.data.data.user,
  };
},


  verifyOtp: async (payload: { email: string; otp: string }): Promise<void> => {
    await api.post("/auth/verify-otp", payload);
  },

  resendOtp: async (email: string): Promise<void> => {
    await api.post("/auth/resend-otp", { email });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (
    payload: ResetPasswordPayload
  ): Promise<void> => {
    await api.post("/auth/reset-password", payload);
  },
refresh: async (): Promise<AuthResponse> => {
   const res = await api.post("/auth/refresh");
  return res.data.data; // { accessToken, user }
},




  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

 

  googleLogin: async (credential: string): Promise<AuthResponse> => {
  const res = await api.post("/auth/google", { credential });

  return {
    accessToken: res.data.data.accessToken,
    user: res.data.data.user,
  };
},

};

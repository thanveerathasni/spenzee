

import { api } from "./axios";
import type { User } from "../store/auth/auth.types";

/* ---------- Types ---------- */

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
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
  email: string;
  token: string;
  newPassword: string;
}

/* ---------- MAIN AUTH API ---------- */

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

  verifyOtp: async (payload: { email: string; otp: string }) => {
    await api.post("/auth/verify-otp", payload);
  },

  resendOtp: async (email: string) => {
    await api.post("/auth/resend-otp", { email });
  },

  forgotPassword: async (email: string) => {
    await api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    await api.post("/auth/reset-password", payload);
  },

  refresh: async (): Promise<AuthResponse> => {
    const res = await api.post("/auth/refresh");

    return {
      accessToken: res.data.data.accessToken,
      user: res.data.data.user,
    };
  },

  logout: async () => {
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

/* ---------- PASSWORD CHANGE ---------- */

export const sendPasswordOtpApi = async (): Promise<void> => {
  await api.post("/user/password/send-otp");
};

export const verifyPasswordOtpApi = async (
  otp: string
): Promise<void> => {
  await api.post("/user/password/verify-otp", { otp });
};

export const updatePasswordApi = async (
  newPassword: string
): Promise<void> => {
  await api.patch("/user/password/update", { newPassword });
};

/* ---------- EMAIL CHANGE (LOGGED-IN USER) ---------- */

export const requestEmailChangeApi = async (
  newEmail: string
): Promise<void> => {
  await api.post("/auth/user/email/send-otp", { newEmail });
};

export const verifyEmailOtpApi = async (
  newEmail: string,
  otp: string
): Promise<void> => {
  await api.post("/auth/user/email/verify-otp", { newEmail, otp });
};

export const updateEmailApi = async (
  newEmail: string
): Promise<void> => {
  await api.patch("/auth/user/email/update", { newEmail });
};
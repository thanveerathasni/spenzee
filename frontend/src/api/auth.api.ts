import { api } from "./axios";

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
}

/* ---------- API ---------- */

export const authApi = {
  signup: (data: SignupRequest) =>
    api.post<void>("/auth/signup", data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data),

  verifyOtp: (email: string, otp: string) =>
    api.post<void>("/auth/verify-otp", { email, otp }),

  resendOtp: (email: string) =>
    api.post<void>("/auth/resend-otp", { email }),

  refresh: () =>
    api.post<AuthResponse>("/auth/refresh"),

  logout: () =>
    api.post<void>("/auth/logout"),
};

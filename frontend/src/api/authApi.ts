import api from "./axios";

export const signupApi = (data: any) =>
  api.post("/auth/signup", data);

export const loginApi = (data: any) =>
  api.post("/auth/login", data);

export const verifyOtpApi = (data: { email: string; otp: string }) =>
  api.post("/auth/verify-otp", data);

export const resendOtpApi = (email: string) =>
  api.post("/auth/resend-otp", { email });

export const logoutApi = () =>
  api.post("/auth/logout");

// No manual token here — interceptor handles it
export const profileApi = () =>
  api.get("/auth/profile");

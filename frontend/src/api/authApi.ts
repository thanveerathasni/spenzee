import api from "./axios";

export const signupApi = (data: any) =>
  api.post("/auth/signup", data);

export const loginApi = async (data: any) => {
  const res = await api.post("/auth/login", data);
  localStorage.setItem("accessToken", res.data.accessToken);
  return res.data;
};

export const verifyOtpApi = (data: { email: string; otp: string }) =>
  api.post("/auth/verify-otp", data);

export const resendOtpApi = (email: string) =>
  api.post("/auth/resend-otp", { email });

export const logoutApi = async () => {
  await api.post("/auth/logout");
  localStorage.clear();
};

export const profileApi = () =>
  api.get("/auth/profile");

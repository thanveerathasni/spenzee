import { api } from "../axios";

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
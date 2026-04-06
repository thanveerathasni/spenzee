import axios from "axios";

export const requestEmailChangeApi = (newEmail: string) => {
  return axios.post("/api/user/email/request", { newEmail });
};

export const confirmEmailChangeApi = (
  newEmail: string,
  otp: string
) => {
  return axios.post("/api/user/email/confirm", {
    newEmail,
    otp,
  });
};
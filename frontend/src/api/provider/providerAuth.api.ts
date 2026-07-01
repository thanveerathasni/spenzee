






import { api } from "../axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export const providerAuthApi = {

  /* ================= LOGIN ================= */

  login: async (
    email: string,
    password: string
  ) => {

    const res = await api.post(
      API_ROUTES.PROVIDER.LOGIN,
      {
        email,
        password,
      }
    );

    return res.data.data;
  },

  /* ================= FORGOT PASSWORD ================= */

  forgotPassword: async (
    email: string
  ) => {

    const res = await api.post(
      API_ROUTES.PROVIDER.FORGOT_PASSWORD,
      {
        email,
      }
    );

    return res.data;
  },

  /* ================= RESET PASSWORD ================= */

  resetPassword: async (
    data: {
      email: string;
      token: string;
      newPassword: string;
    }
  ) => {

    const res = await api.post(
      API_ROUTES.PROVIDER.RESET_PASSWORD,
      data
    );

    return res.data;
  },

  /* ================= ACCEPT TERMS ================= */

  acceptTerms: async () => {

    await api.patch(
      "/provider/accept-terms"
    );
  },

  /* ================= LOGOUT ================= */

  logout: async () => {

    await api.post(
      API_ROUTES.AUTH.LOGOUT
    );
  },
};
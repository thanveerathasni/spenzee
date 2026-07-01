import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export const adminAuthApi =
  {
    /* ============================================== */
    /* LOGIN */
    /* ============================================== */

    login: async (
      payload: {
        email: string;

        password: string;
      },
    ) => {
      const res =
        await axios.post(
          `${API_URL}/admin/auth/login`,
          payload,
          {
            withCredentials: true,
          },
        );

      return res.data.data;
    },

    /* ============================================== */
    /* REFRESH */
    /* ============================================== */

    refresh:
      async () => {
        const res =
          await axios.post(
            `${API_URL}/admin/auth/refresh`,
            {},
            {
              withCredentials: true,
            },
          );

        return res.data.data;
      },

    /* ============================================== */
    /* LOGOUT */
    /* ============================================== */

    logout:
      async () => {
        await axios.post(
          `${API_URL}/admin/auth/logout`,
          {},
          {
            withCredentials: true,
          },
        );
      },

    /* ============================================== */
    /* DASHBOARD */
    /* ============================================== */

    getDashboard:
      async (
        accessToken: string,
      ) => {
        const res =
          await axios.get(
            `${API_URL}/admin/dashboard`,
            {
              headers: {
                Authorization:
                  `Bearer ${accessToken}`,
              },

              withCredentials: true,
            },
          );

        return res.data.data;
      },
  };
// import { api } from "./axios";
// import { API_ROUTES } from "../constants/apiRoutes";
// import type { User } from "../store/auth/auth.types";

// /* ---------- Types ---------- */

// export interface SignupRequest {
//   name: string;
//   email: string;
//   password: string;
//   role?: string;
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface AuthResponse {
//   accessToken: string;
//   user: User;
// }

// export interface ResetPasswordPayload {
//   email: string;
//   token: string;
//   newPassword: string;
// }

// /* ---------- MAIN AUTH API ---------- */

// export const authApi = {
//   signup: async (data: SignupRequest): Promise<void> => {
//     await api.post(API_ROUTES.AUTH.SIGNUP, data);
//   },

//   login: async (data: LoginRequest): Promise<AuthResponse> => {
//     const res = await api.post(API_ROUTES.AUTH.LOGIN, data);

//     return {
//       accessToken: res.data.data.accessToken,
//       user: res.data.data.user,
//     };
//   },

//   verifyOtp: async (payload: { email: string; otp: string }) => {
//     await api.post(API_ROUTES.AUTH.VERIFY_OTP, payload);
//   },

//   resendOtp: async (data: {
//     email: string;
//     name?: string;
//     password?: string;
//     role?: string;
//   }) => {
//     await api.post(API_ROUTES.AUTH.RESEND_OTP, data);
//   },

//   forgotPassword: async (email: string) => {
//     await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
//   },

//   resetPassword: async (payload: ResetPasswordPayload) => {
//     await api.post(API_ROUTES.AUTH.RESET_PASSWORD, payload);
//   },

//   refresh: async (): Promise<AuthResponse> => {
//     const res = await api.post(API_ROUTES.AUTH.REFRESH);

//     return {
//       accessToken: res.data.data.accessToken,
//       user: res.data.data.user,
//     };
//   },

//   logout: async () => {
//     await api.post(API_ROUTES.AUTH.LOGOUT);
//   },

//   googleLogin: async (credential: string): Promise<AuthResponse> => {
//     const res = await api.post(API_ROUTES.AUTH.GOOGLE, { credential });

//     return {
//       accessToken: res.data.data.accessToken,
//       user: res.data.data.user,
//     };
//   },
// };

// /* ---------- PASSWORD CHANGE ---------- */

// export const sendPasswordOtpApi = async (): Promise<void> => {
//   await api.post(API_ROUTES.USER.CHANGE_PASSWORD_SEND_OTP);
// };

// export const verifyPasswordOtpApi = async (
//   otp: string
// ): Promise<void> => {
//   await api.post(API_ROUTES.USER.CHANGE_PASSWORD_VERIFY_OTP, { otp });
// };

// export const updatePasswordApi = async (
//   newPassword: string
// ): Promise<void> => {
//   await api.patch(API_ROUTES.USER.CHANGE_PASSWORD_UPDATE, { newPassword });
// };

// /* ---------- EMAIL CHANGE ---------- */

// export const requestEmailChangeApi = async (
//   newEmail: string
// ): Promise<void> => {
//   await api.post("/auth/user/email/send-otp", { newEmail });
// };

// export const verifyEmailOtpApi = async (
//   newEmail: string,
//   otp: string
// ): Promise<void> => {
//   await api.post("/auth/user/email/verify-otp", { newEmail, otp });
// };

// export const updateEmailApi = async (
//   newEmail: string
// ): Promise<void> => {
//   await api.patch("/auth/user/email/update", { newEmail });
// };


















import { api } from "./axios";

import { API_ROUTES } from "../constants/apiRoutes";

import type {
  User,
} from "../store/auth/auth.types";

/* ====================================================== */
/* TYPES */
/* ====================================================== */

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

export interface UpdatePasswordPayload {
  currentPassword: string;

  newPassword: string;
}

/* ====================================================== */
/* AUTH */
/* ====================================================== */

export const authApi = {
  /* ================= SIGNUP ================= */

  signup: async (
    data: SignupRequest,
  ): Promise<void> => {
    await api.post(
      API_ROUTES.AUTH.SIGNUP,
      data,
    );
  },

  /* ================= LOGIN ================= */

 login: async (
  data: LoginRequest,
): Promise<AuthResponse> => {
  const res =
    await api.post(
      API_ROUTES.AUTH.LOGIN,
      data,
      {
        withCredentials: true,
      },
    );

  return {
    accessToken:
      res.data.data.accessToken,

    user:
      res.data.data.user,
  };
},

  /* ================= VERIFY OTP ================= */

  verifyOtp: async (
    payload: {
      email: string;

      otp: string;
    },
  ): Promise<void> => {
    await api.post(
      API_ROUTES.AUTH.VERIFY_OTP,
      payload,
    );
  },

  /* ================= RESEND OTP ================= */

  resendOtp: async (
    data: {
      email: string;

      name?: string;

      password?: string;

      role?: string;
    },
  ): Promise<void> => {
    await api.post(
      API_ROUTES.AUTH.RESEND_OTP,
      data,
    );
  },

  /* ================= FORGOT PASSWORD ================= */

  forgotPassword: async (
    email: string,
  ): Promise<void> => {
    await api.post(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      { email },
    );
  },

  /* ================= RESET PASSWORD ================= */

  resetPassword: async (
    payload: ResetPasswordPayload,
  ): Promise<void> => {
    await api.post(
      API_ROUTES.AUTH.RESET_PASSWORD,
      payload,
    );
  },

  /* ================= REFRESH ================= */

refresh: async (): Promise<AuthResponse> => {
  const res =
    await api.post(
      API_ROUTES.AUTH.REFRESH,
      {},
      {
        withCredentials: true,
      },
    );

  return {
    accessToken:
      res.data.data.accessToken,

    user:
      res.data.data.user,
  };
},

  /* ================= LOGOUT ================= */

 logout: async (): Promise<void> => {
  await api.post(
    API_ROUTES.AUTH.LOGOUT,
    {},
    {
      withCredentials: true,
    },
  );
},

  /* ================= GOOGLE ================= */

  googleLogin: async (
    credential: string,
  ): Promise<AuthResponse> => {
    const res =
      await api.post(
        API_ROUTES.AUTH.GOOGLE,
        {
          credential,
        },
      );

    return {
      accessToken:
        res.data.data.accessToken,

      user:
        res.data.data.user,
    };
  },
};

/* ====================================================== */
/* PASSWORD */
/* ====================================================== */

export const sendPasswordOtpApi =
  async (): Promise<void> => {
    await api.post(
      API_ROUTES.USER.PASSWORD_SEND_OTP,
    );
  };

export const verifyPasswordOtpApi =
  async (
    otp: string,
  ): Promise<void> => {
    await api.post(
      API_ROUTES.USER.PASSWORD_VERIFY_OTP,
      { otp },
    );
  };

export const updatePasswordApi =
  async (
    payload: UpdatePasswordPayload,
  ): Promise<void> => {
    await api.patch(
      API_ROUTES.USER.PASSWORD_UPDATE,
      payload,
    );
  };

/* ====================================================== */
/* EMAIL */
/* ====================================================== */

export const requestEmailChangeApi =
  async (
    newEmail: string,
  ): Promise<void> => {
    await api.post(
      API_ROUTES.USER.EMAIL_REQUEST,
      {
        newEmail,
      },
    );
  };

export const verifyEmailOtpApi =
  async (
    newEmail: string,
    otp: string,
  ): Promise<void> => {
    await api.post(
      API_ROUTES.USER.EMAIL_CONFIRM,
      {
        newEmail,
        otp,
      },
    );
  };

export const updateEmailApi =
  async (
    newEmail: string,
  ): Promise<void> => {
    await api.patch(
      API_ROUTES.USER.EMAIL_CONFIRM,
      {
        newEmail,
      },
    );
  };
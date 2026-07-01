import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { store } from "../store/store";

import {
  clearAuth,
  setAuth,
} from "../store/auth/auth.slice";

import {
  authApi,
} from "./auth.api";

import {
  API_ROUTES,
} from "../constants/apiRoutes";

const API_URL =
  import.meta.env
    .VITE_API_URL;

/* ====================================================== */
/* API INSTANCE */
/* ====================================================== */

export const api =
  axios.create({
    baseURL: API_URL,

    withCredentials: true,
  });

/* ====================================================== */
/* REQUEST INTERCEPTOR */
/* ====================================================== */

api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ) => {
    const accessToken =
      store.getState()
        .auth.accessToken;

    /* ============================================== */
    /* ATTACH TOKEN ONLY IF EXISTS */
    /* ============================================== */

    if (
      accessToken &&
      config.headers
    ) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
);

/* ====================================================== */
/* REFRESH CONTROL */
/* ====================================================== */

let isRefreshing =
  false;

let failedQueue: Array<{
  resolve: (
    token: string,
  ) => void;

  reject: (
    error: unknown,
  ) => void;
}> = [];

/* ====================================================== */
/* PROCESS QUEUE */
/* ====================================================== */

const processQueue = (
  error: unknown,
  token: string | null =
    null,
) => {
  failedQueue.forEach(
    (promise) => {
      if (error) {
        promise.reject(
          error,
        );
      } else if (
        token
      ) {
        promise.resolve(
          token,
        );
      }
    },
  );

  failedQueue = [];
};

/* ====================================================== */
/* RESPONSE INTERCEPTOR */
/* ====================================================== */

api.interceptors.response.use(
  (
    response,
  ) => response,

  async (
    error: AxiosError,
  ) => {
    const original =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    /* ============================================== */
    /* SAFETY */
    /* ============================================== */

    if (!original) {
      return Promise.reject(
        error,
      );
    }

    console.log(
      "401 URL:",
      original.url,
    );

    /* ============================================== */
    /* PUBLIC ROUTES */
    /* ============================================== */

    const isPublicRoute =
      original.url?.includes(
        API_ROUTES.AUTH.LOGIN,
      ) ||
      original.url?.includes(
        API_ROUTES.AUTH.SIGNUP,
      ) ||
      original.url?.includes(
        API_ROUTES.AUTH.REFRESH,
      ) ||
      original.url?.includes(
        API_ROUTES.AUTH.VERIFY_OTP,
      ) ||
      original.url?.includes(
        API_ROUTES.AUTH.RESEND_OTP,
      ) ||
      original.url?.includes(
        API_ROUTES.AUTH.FORGOT_PASSWORD,
      ) ||
      original.url?.includes(
        API_ROUTES.AUTH.RESET_PASSWORD,
      );

    if (
      isPublicRoute
    ) {
      return Promise.reject(
        error,
      );
    }

    /* ============================================== */
    /* HANDLE NON 401 */
    /* ============================================== */

    if (
      error.response
        ?.status !== 401
    ) {
      return Promise.reject(
        error,
      );
    }

    /* ============================================== */
    /* ALREADY RETRIED */
    /* ============================================== */

    if (
      original._retry
    ) {
      store.dispatch(
        clearAuth(),
      );

      return Promise.reject(
        error,
      );
    }

    original._retry =
      true;

    /* ============================================== */
    /* REFRESH IN PROGRESS */
    /* ============================================== */

    if (
      isRefreshing
    ) {
      return new Promise(
        (
          resolve,
          reject,
        ) => {
          failedQueue.push({
            resolve: (
              token: string,
            ) => {
              if (
                original.headers
              ) {
                original.headers.Authorization =
                  `Bearer ${token}`;
              }

              resolve(
                api(
                  original,
                ),
              );
            },

            reject,
          });
        },
      );
    }

    isRefreshing =
      true;

    /* ============================================== */
    /* REFRESH TOKEN */
    /* ============================================== */

    try {
      const refreshed =
        await authApi.refresh();

      /* ================= STORE ================= */

      store.dispatch(
        setAuth({
          accessToken:
            refreshed.accessToken,

          user:
            refreshed.user,
        }),
      );

      /* ================= QUEUE ================= */

      processQueue(
        null,
        refreshed.accessToken,
      );

      /* ================= RETRY ================= */

      if (
        original.headers
      ) {
        original.headers.Authorization =
          `Bearer ${refreshed.accessToken}`;
      }

      return api(
        original,
      );
    } catch (
      refreshError
    ) {
      processQueue(
        refreshError,
        null,
      );

      store.dispatch(
        clearAuth(),
      );

      return Promise.reject(
        refreshError,
      );
    } finally {
      isRefreshing =
        false;
    }
  },
);
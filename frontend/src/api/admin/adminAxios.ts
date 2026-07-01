import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { store } from "../../store/store";

import {
  clearAdminAuth,
  setAdminAuth,
} from "../../store/admin/adminAuth.slice";

import { adminAuthApi } from "./adminAuth.api";

const API_URL =
  import.meta.env.VITE_API_URL;

/* ====================================================== */
/* AXIOS INSTANCE */
/* ====================================================== */

export const adminApi =
  axios.create({
    baseURL: API_URL,

    withCredentials: true,
  });

/* ====================================================== */
/* REQUEST INTERCEPTOR */
/* ====================================================== */

adminApi.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ) => {
    const accessToken =
      store.getState()
        .adminAuth.accessToken;

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

adminApi.interceptors.response.use(
  (response) =>
    response,

  async (
    error: AxiosError,
  ) => {
    const original =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    if (!original) {
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
        clearAdminAuth(),
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
                adminApi(
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

    try {
      const refreshed =
        await adminAuthApi.refresh();

      store.dispatch(
        setAdminAuth({
          accessToken:
            refreshed.accessToken,

          admin:
            refreshed.admin,
        }),
      );

      processQueue(
        null,
        refreshed.accessToken,
      );

      if (
        original.headers
      ) {
        original.headers.Authorization =
          `Bearer ${refreshed.accessToken}`;
      }

      return adminApi(
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
        clearAdminAuth(),
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
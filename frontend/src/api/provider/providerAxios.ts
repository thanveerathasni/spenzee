import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { store } from "../../store/store";

import {
  clearAuth,
  setAuth,
} from "../../store/auth/auth.slice";

const API_URL =
  import.meta.env.VITE_API_URL;

/* ====================================================== */
/* AXIOS INSTANCE */
/* ====================================================== */

export const providerApi =
  axios.create({
    baseURL: API_URL,

    withCredentials: true,
  });

/* ====================================================== */
/* REQUEST INTERCEPTOR */
/* ====================================================== */

providerApi.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ) => {
    const accessToken =
      store.getState()
        .auth.accessToken;

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

providerApi.interceptors.response.use(
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

    if (
      error.response
        ?.status !== 401
    ) {
      return Promise.reject(
        error,
      );
    }

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
                providerApi(
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
      const res =
        await axios.post(
          `${API_URL}/provider/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

      const refreshed =
        res.data.data;

      store.dispatch(
        setAuth({
          accessToken:
            refreshed.accessToken,

          user:
            refreshed.user,
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

      return providerApi(
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
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { store } from "../store/store";
import { clearAuth, setAuth } from "../store/auth";

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/* ================= REQUEST ================= */

api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/* ================= QUEUE ================= */

let isRefreshing = false;

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else if (token) promise.resolve(token);
  });

  failedQueue = [];
};

/* ================= RESPONSE ================= */

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as RetryAxiosRequestConfig;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (
      original.url?.includes("/auth/login") ||
      original.url?.includes("/auth/signup") ||
      original.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (original._retry) {
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }
    if (
  error.response?.status === 401 &&
  error.response?.data?.message?.includes("blocked")
) {
  store.dispatch(clearAuth());
  window.location.href = "/login";
}

    isRefreshing = true;

    try {
  
      const res = await api.post("/auth/refresh");

      const data = res.data.data;

      store.dispatch(
        setAuth({
          accessToken: data.accessToken,
          user: data.user,
        })
      );

      processQueue(null, data.accessToken);

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${data.accessToken}`;

      return api(original);
    } catch (err) {
      processQueue(err, null);
      store.dispatch(clearAuth());
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
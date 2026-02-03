






import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { store } from "../store/store";
import { clearAuth, setAuth } from "../store/auth";

/* --------------------
   Types
-------------------- */

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

/* --------------------
   Axios Instance
-------------------- */

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,

});

/* --------------------
   Request Interceptor
-------------------- */

api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/* --------------------
   Refresh State
-------------------- */

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

/* --------------------
   Response Interceptor (ONLY ONE)
-------------------- */



api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as RetryAxiosRequestConfig;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (original.url?.includes("/auth")) {
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }

    if (original._retry) {
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const { data } = await api.post("/auth/refresh");

      store.dispatch(
        setAuth({
          accessToken: data.accessToken,
          user: data.user,
        })
      );

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${data.accessToken}`;

      return api(original);
    } catch {
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }
  }
);




import axios from "axios";
import { store } from "../../store/store";
import { clearAuth } from "../../store/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const adminApi = axios.create({
  baseURL: API_URL,
});

adminApi.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearAuth());
    }

    return Promise.reject(error);
  }
);

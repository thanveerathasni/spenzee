import axios from "axios";
import { adminAuthStore } from "../../store/admin/adminAuth";

const API_URL = import.meta.env.VITE_API_URL;

export const adminApi = axios.create({
  baseURL: API_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = adminAuthStore.getToken();

  // console.log("ADMIN TOKEN:", token);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      adminAuthStore.clearToken();
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);
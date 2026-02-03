import axios from "axios";
import { adminAuthStore } from "../../store/admin/adminAuth";

const API_URL = import.meta.env.VITE_API_URL;

export const adminApi = axios.create({
  baseURL: API_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = adminAuthStore.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

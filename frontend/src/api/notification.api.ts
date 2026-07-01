import axios from "axios";
import { store } from "../store/store";
import type { AppNotification, NotificationListResponse } from "../types/notification";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getActiveToken = () =>
  store.getState().adminAuth.accessToken ?? store.getState().auth.accessToken;

const notificationClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

notificationClient.interceptors.request.use((config) => {
  const token = getActiveToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const notificationApi = {
  list: async (): Promise<NotificationListResponse> => {
    const res = await notificationClient.get("/notifications");
    return res.data.data;
  },

  markRead: async (id: string): Promise<AppNotification | null> => {
    const res = await notificationClient.patch(`/notifications/${id}/read`);
    return res.data.data;
  },

  markAllRead: async (): Promise<void> => {
    await notificationClient.patch("/notifications/read-all");
  },

  getStreamUrl: (token: string): string =>
    `${API_BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`,
};

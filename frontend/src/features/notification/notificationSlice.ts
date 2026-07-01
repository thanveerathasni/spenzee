import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppNotification } from "../../types/notification";

interface NotificationState {
  items: AppNotification[];
  unreadCount: number;
  isOpen: boolean;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  isOpen: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<{
        notifications: AppNotification[];
        unreadCount: number;
      }>,
    ) => {
      state.items = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },

    addNotification: (state, action: PayloadAction<AppNotification>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);

      if (!exists) {
        state.items.unshift(action.payload);
      }

      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },

    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((item) => item.id === action.payload);

      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllNotificationsRead: (state) => {
      state.items = state.items.map((item) => ({
        ...item,
        isRead: true,
      }));
      state.unreadCount = 0;
    },

    setNotificationsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },

    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.isOpen = false;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  setNotificationsOpen,
  clearNotifications,
} = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;

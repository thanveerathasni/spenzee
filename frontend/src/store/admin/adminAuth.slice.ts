import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AdminAuthState } from "./adminAuth.types";

const initialState: AdminAuthState = {
  accessToken: null,
  admin: null,
  isAuthenticated: false,
  isAuthChecked: false,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminAuth: (
      state,
      action: PayloadAction<{ accessToken: string; admin: Admin }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
      state.isAuthChecked = true;

      localStorage.setItem(
        "admin_auth",
        JSON.stringify(action.payload)
      );
    },

    clearAdminAuth: (state) => {
      state.accessToken = null;
      state.admin = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;

      localStorage.removeItem("admin_auth");
    },

    hydrateAdminAuth: (state) => {
      const stored = localStorage.getItem("admin_auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        state.accessToken = parsed.accessToken;
        state.admin = parsed.admin;
        state.isAuthenticated = true;
      }
      state.isAuthChecked = true;
    },
  },
});

export const {
  setAdminAuth,
  clearAdminAuth,
  hydrateAdminAuth,
} = adminAuthSlice.actions;

export const adminAuthReducer = adminAuthSlice.reducer;

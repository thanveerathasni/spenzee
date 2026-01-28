import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./auth.types";

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  isLoading: true
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  setAuth: (state, action) => {
  state.accessToken = action.payload.accessToken;
  state.user = action.payload.user;
  state.isAuthenticated = true;
  state.isAuthChecked = true;
  state.isLoading = false;

  // 🔥 persist
  localStorage.setItem(
    "auth",
    JSON.stringify({
      accessToken: action.payload.accessToken,
      user: action.payload.user,
    })
  );
},

clearAuth: (state) => {
  state.accessToken = null;
  state.user = null;
  state.isAuthenticated = false;
  state.isAuthChecked = true;
  state.isLoading = false;

  // 🔥 clear persist
  localStorage.removeItem("auth");
},
hydrateAuth: (state) => {
  const stored = localStorage.getItem("auth");

  if (stored) {
    const parsed = JSON.parse(stored);
    state.accessToken = parsed.accessToken;
    state.user = parsed.user;
    state.isAuthenticated = true;
  }

  state.isAuthChecked = true;
  state.isLoading = false;
},


    markAuthChecked: (state) => {
      state.isAuthChecked = true;
      state.isLoading = false;
    }
  },
});



export const { setAuth, clearAuth, markAuthChecked, hydrateAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;

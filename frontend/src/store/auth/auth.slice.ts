import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import type {
  AuthState,
  User,
} from "./auth.types";

const initialState: AuthState =
  {
    accessToken: null,

    user: null,

    isAuthenticated: false,

    isAuthChecked: false,

    isLoading: true,
  };

interface SetAuthPayload {
  accessToken: string;

  user: User;
}

const authSlice =
  createSlice({
    name: "auth",

    initialState,

    reducers: {
      /* ====================================================== */
      /* SET AUTH */
      /* ====================================================== */

      setAuth: (
        state,
        action: PayloadAction<SetAuthPayload>,
      ) => {
        state.accessToken =
          action.payload.accessToken;

        state.user =
          action.payload.user;

        state.isAuthenticated = true;

        state.isAuthChecked = true;

        state.isLoading = false;
      },

      /* ====================================================== */
      /* SET USER */
      /* ====================================================== */

      setUser: (
        state,
        action: PayloadAction<User>,
      ) => {
        state.user =
          action.payload;
      },

      /* ====================================================== */
      /* CLEAR AUTH */
      /* ====================================================== */

      clearAuth: (
        state,
      ) => {
        state.accessToken =
          null;

        state.user =
          null;

        state.isAuthenticated = false;

        state.isAuthChecked = true;

        state.isLoading = false;
      },

      /* ====================================================== */
      /* HYDRATE */
      /* ====================================================== */

      hydrateAuth: (
        state,
        action: PayloadAction<{
          accessToken: string | null;

          user: User | null;
        }>,
      ) => {
        state.accessToken =
          action.payload.accessToken;

        state.user =
          action.payload.user;

        state.isAuthenticated =
          Boolean(
            action.payload.accessToken &&
              action.payload.user,
          );

        state.isAuthChecked = true;

        state.isLoading = false;
      },

      /* ====================================================== */
      /* AUTH CHECKED */
      /* ====================================================== */

      markAuthChecked: (
        state,
      ) => {
        state.isAuthChecked =
          true;

        state.isLoading =
          false;
      },
    },
  });

export const {
  setAuth,
  setUser,
  clearAuth,
  hydrateAuth,
  markAuthChecked,
} = authSlice.actions;

export const authReducer =
  authSlice.reducer;
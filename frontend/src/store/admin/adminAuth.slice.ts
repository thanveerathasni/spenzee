import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import type {
  Admin,
  AdminAuthState,
} from "../../types/admin/adminAuth.types";

const initialState: AdminAuthState =
  {
    accessToken: null,

    admin: null,

    isAuthenticated: false,

    isAuthChecked: false,
  };

interface SetAdminAuthPayload {
  accessToken: string;

  admin: Admin;
}

const adminAuthSlice =
  createSlice({
    name: "adminAuth",

    initialState,

    reducers: {
      /* ====================================================== */
      /* SET AUTH */
      /* ====================================================== */

      setAdminAuth: (
        state,
        action: PayloadAction<SetAdminAuthPayload>,
      ) => {
        state.accessToken =
          action.payload.accessToken;

        state.admin =
          action.payload.admin;

        state.isAuthenticated =
          true;

        state.isAuthChecked =
          true;
      },

      /* ====================================================== */
      /* CLEAR AUTH */
      /* ====================================================== */

      clearAdminAuth: (
        state,
      ) => {
        state.accessToken =
          null;

        state.admin =
          null;

        state.isAuthenticated =
          false;

        /* ============================================== */
        /* IMPORTANT FIX */
        /* ============================================== */

        state.isAuthChecked =
          true;
      },

      /* ====================================================== */
      /* HYDRATE */
      /* ====================================================== */

      hydrateAdminAuth: (
        state,
        action: PayloadAction<{
          accessToken: string | null;

          admin: Admin | null;
        }>,
      ) => {
        state.accessToken =
          action.payload.accessToken;

        state.admin =
          action.payload.admin;

        state.isAuthenticated =
          Boolean(
            action.payload.accessToken &&
              action.payload.admin,
          );

        state.isAuthChecked =
          true;
      },
    },
  });

export const {
  setAdminAuth,
  clearAdminAuth,
  hydrateAdminAuth,
} = adminAuthSlice.actions;

export const adminAuthReducer =
  adminAuthSlice.reducer;
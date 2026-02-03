import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { adminAuthReducer } from "./admin";

export const store = configureStore({
  reducer: {
    auth: authReducer,        // user
    adminAuth: adminAuthReducer, // admin
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

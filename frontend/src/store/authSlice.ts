import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authRepository } from "../repositories/authRepository";
import { setTokens, clearTokens } from "../util/tokenStorage";
const savedAuth = localStorage.getItem("auth");
const parsedAuth = savedAuth ? JSON.parse(savedAuth) : null;




interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "provider" | "admin";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: parsedAuth?.user || null,
  accessToken: parsedAuth?.accessToken || null,
  refreshToken: parsedAuth?.refreshToken || null,
  loading: false,
  error: null,
  isLoggedIn: !!parsedAuth,
};


export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await authRepository.login(data);

      const { user, accessToken, refreshToken } = res.data;

      // Save tokens for axios interceptor
      setTokens(accessToken, refreshToken);

      return { user, accessToken, refreshToken };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoggedIn = false;
      clearTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isLoggedIn = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoggedIn = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

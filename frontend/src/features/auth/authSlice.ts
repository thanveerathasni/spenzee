import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userProfileApi } from "../../api/user/userProfile.api";

interface User {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
};

export const fetchProfile = createAsyncThunk("auth/profile", async () => {
  const data = await userProfileApi.getProfile();
  return { data };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;

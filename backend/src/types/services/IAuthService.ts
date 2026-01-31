import { IUser } from "../../models/User.model";

export interface IAuthService {
  // ======================
  // AUTH CORE
  // ======================
  login(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }>;

  refreshAccessToken(
    refreshToken: string
  ): Promise<{
    accessToken: string;
    // refreshToken: string;
    user: IUser;
  }>;

  logout(refreshToken: string): Promise<void>;

  // ======================
  // SIGNUP + OTP
  // ======================
  signup(email: string, password: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  resendOtp(email: string): Promise<void>;

  // ======================
  // PASSWORD RESET
  // ======================
  forgotPassword(email: string): Promise<string | null>;
  sendResetPasswordEmail(
    email: string,
    resetToken: string
  ): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;

  // ======================
  // GOOGLE AUTH
  // ======================
  googleLogin(
    credential: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }>;
}

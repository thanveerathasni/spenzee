import { IUser } from "../../../models/User.model";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;

  refreshAccessToken(refreshToken: string): Promise<AuthResponse>;

  logout(refreshToken: string): Promise<void>;

  signup(email: string, password: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  resendOtp(email: string): Promise<void>;

  forgotPassword(email: string): Promise<string | null>;

  sendResetPasswordEmail(
    email: string,
    resetToken: string
  ): Promise<void>;

  resetPassword(token: string, newPassword: string): Promise<void>;

  googleLogin(credential: string): Promise<AuthResponse>;
}
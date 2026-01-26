export interface IAuthService {
  login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }>;

  refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string }>;

  signup(email: string, password: string): Promise<void>;

  verifyOtp(email: string, otp: string): Promise<void>;

  resendOtp(email: string): Promise<void>;

  forgotPassword(email: string): Promise<string | null>;

  sendResetPasswordEmail(
    email: string,
    resetToken: string
  ): Promise<void>;

  resetPassword(
  token: string,
  newPassword: string
): Promise<void>;

}

export interface IAuthService {
  login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }>;

refreshAccessToken(
  refreshToken: string
): Promise<{
  accessToken: string;
  refreshToken: string;
}>;


  signup(email: string, password: string): Promise<void>;

  verifyOtp(email: string, otp: string): Promise<void>;

  resendOtp(email: string): Promise<void>;


  logout(refreshToken: string): Promise<void>;

logoutAll(userId: string): Promise<void>;

}

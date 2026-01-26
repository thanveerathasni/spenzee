export interface IMailService {
  sendOtp(email: string, otp: string): Promise<void>;
sendResetPasswordEmail(
    email: string,
    resetToken: string
  ): Promise<void>;


}

export interface IMailService {
  sendOtp(email: string, otp: string): Promise<void>;

  sendResetPasswordEmail(email: string, resetToken: string): Promise<void>;
sendProviderResetPasswordEmail(
  email: string,
  resetToken: string
): Promise<void>;
  sendGenericEmail(email: string, subject: string, message: string): Promise<void>;
}

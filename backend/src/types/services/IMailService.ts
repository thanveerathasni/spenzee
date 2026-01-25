export interface IMailService {
  sendOtp(email: string, otp: string): Promise<void>;
}

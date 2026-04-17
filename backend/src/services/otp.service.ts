import { OtpModel } from "../models/OtpModel";
import { hashOtp } from "../shared/utils/otpHash";

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;

export class OtpService {
  async sendOtp(email: string): Promise<void> {
    const existing = await OtpModel.findOne({ email });

    if (existing) {
      const diff = (Date.now() - existing.createdAt.getTime()) / 1000;

      if (diff < RESEND_COOLDOWN_SECONDS) {
        throw new Error("Please wait before requesting another OTP");
      }

      await OtpModel.deleteOne({ email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = hashOtp(otp);

    await OtpModel.create({
      email,
      otpHash: hashedOtp,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    });

    // integrate with your MailService
    console.log("OTP:", otp);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const record = await OtpModel.findOne({ email });

    if (!record) throw new Error("OTP not found");

    if (record.expiresAt < new Date()) {
      await OtpModel.deleteOne({ email });
      throw new Error("OTP expired");
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      await OtpModel.deleteOne({ email });
      throw new Error("Too many attempts");
    }

    const hashedOtp = hashOtp(otp);

    if (record.otpHash !== hashedOtp) {
      record.attempts += 1;
      await record.save();
      throw new Error("Invalid OTP");
    }

    await OtpModel.deleteOne({ email });

    return true;
  }
}
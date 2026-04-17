import { injectable } from "inversify";
import nodemailer from "nodemailer";
import { LOG_MESSAGES} from "../shared/constants/logMessages"; 
import { SYSTEM_MESSAGES } from "../shared/constants/systemMessages";
import {logger} from "../shared/logger/logger"; 
import { IMailService } from "../types/services/IMailService";

@injectable()
export class MailService implements IMailService {
  private readonly _transporter;

  constructor() {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error(SYSTEM_MESSAGES.CONFIG.MISSING_MAIL_CONFIG);
    }

    this._transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    await this._transporter.sendMail({
      from: `"Spenzee" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify your Spenzee account",
      text: `Your OTP is ${otp}.`,
    });
  }

async sendResetPasswordEmail(email: string, resetToken: string): Promise<void> {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?email=${email}&token=${resetToken}`;

  await this._transporter.sendMail({
    from: `"Spenzee" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    text: `Reset password using this link: ${resetLink}`,
  });
logger.info(LOG_MESSAGES.EMAIL.RESET_PASSWORD_SENT, { email });    
}

  async sendGenericEmail(email: string, subject: string, message: string): Promise<void> {
    await this._transporter.sendMail({
      from: `"Spenzee" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
    });
  }
}


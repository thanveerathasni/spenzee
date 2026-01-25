import { injectable } from "inversify";
import nodemailer from "nodemailer";
import { IMailService } from "../types/services/IMailService";

@injectable()
export class MailService implements IMailService {
  private transporter;

  constructor() {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error("Mail credentials are missing");
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  }


  async sendOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Spenzee" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify your Spenzee account",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });
  }
}

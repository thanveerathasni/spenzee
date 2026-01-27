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

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #111;">🔐 Spenzee Account Verification</h2>

        <p>Use the OTP below to verify your account:</p>

        <div style="
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 4px;
          margin: 20px 0;
          color: #000;
        ">
          ${otp}
        </div>

        <p>This OTP is valid for <b>10 minutes</b>.</p>

        <p style="color: #555;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

async sendResetPasswordEmail(
  email: string,
  resetToken: string
): Promise<void> {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await this.transporter.sendMail({
    from: `"Spenzee" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Reset your Spenzee password",

    text: `Reset your password using this link: ${resetLink}. This link expires in 15 minutes.`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #111;">🔁 Reset Your Password</h2>

        <p>You requested to reset your Spenzee password.</p>

        <a href="${resetLink}"
           style="
             display: inline-block;
             margin: 20px 0;
             padding: 12px 20px;
             background-color: #000;
             color: #fff;
             text-decoration: none;
             border-radius: 6px;
             font-weight: bold;
           ">
          Reset Password
        </a>

        <p>This link will expire in <b>15 minutes</b>.</p>

        <p style="color: #555;">
          If you didn’t request this, please ignore this email.
        </p>
      </div>
    `,
  });
}
}

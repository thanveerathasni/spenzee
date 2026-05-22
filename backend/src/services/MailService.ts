import { injectable } from "inversify";

import nodemailer, {
  Transporter,
} from "nodemailer";

import { LOG_MESSAGES } from "../shared/constants/logMessages";

import { SYSTEM_MESSAGES } from "../shared/constants/systemMessages";

import { logger } from "../shared/logger/logger";

import { IMailService } from "../types/services/IMailService";

@injectable()
export class MailService
  implements IMailService
{
  private readonly _transporter: Transporter;

  private readonly _senderEmail: string;

  private readonly _clientUrl: string;

  constructor() {
    const mailUser =
      process.env.MAIL_USER;

    const mailPass =
      process.env.MAIL_PASS;

    const clientUrl =
      process.env.CLIENT_URL;

    if (
      !mailUser ||
      !mailPass
    ) {
      throw new Error(
        SYSTEM_MESSAGES.CONFIG
          .MISSING_MAIL_CONFIG,
      );
    }

    this._senderEmail =
      mailUser;

    this._clientUrl =
      clientUrl ??
      "http://localhost:5173";

    this._transporter =
      nodemailer.createTransport({
        service: "gmail",

        auth: {
          user: mailUser,

          pass: mailPass,
        },
      });
  }

  /* ====================================================== */
  /* OTP MAIL */
  /* ====================================================== */

  async sendOtp(
    email: string,
    otp: string,
  ): Promise<void> {
    await this._sendMail({
      to: email,

      subject:
        "Verify your Spenzee account",

      text: `Your OTP is ${otp}. This OTP will expire in 5 minutes.`,
    });

    logger.info(
      LOG_MESSAGES.EMAIL.OTP_SENT,
      {
        email,
      },
    );
  }

  /* ====================================================== */
  /* USER RESET PASSWORD */
  /* ====================================================== */

  async sendResetPasswordEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const encodedEmail =
      encodeURIComponent(
        email,
      );

  const encodedToken =
  encodeURIComponent(
    resetToken,
  );

const resetLink =
  `${this._clientUrl}/reset-password?email=${encodedEmail}&token=${encodedToken}`;
  
    await this._sendMail({
      to: email,

      subject:
        "Reset your password",

      text: `Reset your password using this link:\n\n${resetLink}`,
    });

    logger.info(
      LOG_MESSAGES.EMAIL
        .RESET_PASSWORD_SENT,
      {
        email,
      },
    );
  }

  /* ====================================================== */
  /* PROVIDER RESET PASSWORD */
  /* ====================================================== */

  async sendProviderResetPasswordEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const encodedEmail =
      encodeURIComponent(
        email,
      );

    const resetLink =
      `${this._clientUrl}/provider/reset-password?email=${encodedEmail}&token=${resetToken}`;

    await this._sendMail({
      to: email,

      subject:
        "Reset your provider password",

      text: `Reset your provider password using this link:\n\n${resetLink}`,
    });

    logger.info(
      LOG_MESSAGES.EMAIL
        .RESET_PASSWORD_SENT,
      {
        email,

        provider: true,
      },
    );
  }

  /* ====================================================== */
  /* GENERIC MAIL */
  /* ====================================================== */

  async sendGenericEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    await this._sendMail({
      to: email,

      subject,

      text: message,
    });

    logger.info(
      LOG_MESSAGES.EMAIL.OTP_SENT,
      {
        email,

        subject,
      },
    );
  }

  /* ====================================================== */
  /* PRIVATE SHARED MAIL METHOD */
  /* ====================================================== */

  private async _sendMail({
    to,
    subject,
    text,
  }: {
    to: string;

    subject: string;

    text: string;
  }): Promise<void> {
    await this._transporter.sendMail({
      from: `"Spenzee" <${this._senderEmail}>`,

      to,

      subject,

      text,
    });
  }
}
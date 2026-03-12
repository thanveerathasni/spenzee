import nodemailer from "nodemailer";
import { MAIL_MESSAGES } from "../constants/mailMessages";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtpMail = async (to: string, otp: string): Promise<void> => {
  await transporter.sendMail({
    from: `"Spenzee" <${process.env.MAIL_USER}>`,
    to,
    subject: MAIL_MESSAGES.OTP.SUBJECT,
    html: `
      <h1>Spenzee</h1>
      <h2>${MAIL_MESSAGES.OTP.TITLE}</h2>
      <p>${MAIL_MESSAGES.OTP.DESCRIPTION}</p>
      <h1>${otp}</h1>
      <p>${MAIL_MESSAGES.OTP.EXPIRY_NOTICE}</p>
    `,
  });
};

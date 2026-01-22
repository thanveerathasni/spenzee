import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtpMail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: `"Spenzee" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <h1>Spenzee</h1>

      <h2>Your OTP</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>Valid for 60 seconds.</p>
    `,
  });
};
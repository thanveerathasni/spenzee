import { userRepository } from "../user/userRepository";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/jwt";
import { hashPassword, comparePassword } from "../../shared/utils/hash";
import { IUser } from "../user/userModel";
import { generateOTPData } from "../../shared/utils/otp";
import { sendOtpMail } from "../../shared/utils/mailer";
import { OAuth2Client } from "google-auth-library";
import { User } from "../user/userModel";
import { generateOTP, otpExpiry } from "../../shared/utils/otp";
import bcrypt from "bcryptjs";
type Role = "user" | "provider" | "admin";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authService = {
  // ---------- SIGNUP ----------
  signup: async (
    name: string,
    email: string,
    password: string,
    role: Role
  ): Promise<{ message: string }> => {
    const exist = await userRepository.findByEmail(email);
    const hashedPassword = await hashPassword(password);
    const { otp, expiresAt } = generateOTPData();

    if (exist) {
      if (exist.isVerified) {
        throw new Error("Email already exists and is verified");
      }

      // Restart signup for unverified user
      await userRepository.updateByEmail(email, {
        name,
        password: hashedPassword,
        role,
        otp,
        otpExpiresAt: expiresAt,
        isVerified: false,
        otpRequestCount: 1,
        otpLastRequestAt: new Date(),
      });
      await sendOtpMail(email, otp);

      return { message: "OTP resent. Please verify your account." };
    }

    await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiresAt: expiresAt,
      isVerified: false,
      otpRequestCount: 1,
      otpLastRequestAt: new Date(),
    });
    await sendOtpMail(email, otp);

    return { message: "OTP sent to your email" };
  },

  // ---------- VERIFY OTP ----------
  verifyOtp: async (email: string, otp: string): Promise<void> => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.isVerified) throw new Error("Already verified");
    if (!user.otp || !user.otpExpiresAt) throw new Error("No OTP found");
    if (user.otp !== otp) throw new Error("Invalid OTP");
    if (user.otpExpiresAt < new Date()) throw new Error("OTP expired");

    await userRepository.updateByEmail(email, {
      isVerified: true,
      otp: "",
      otpExpiresAt: null,
      otpRequestCount: 0,
      otpLastRequestAt: null,
    });
  },

  // ---------- RESEND OTP ----------
  resendOtp: async (email: string): Promise<void> => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.isVerified) throw new Error("User already verified");

    const now = new Date();

    if (
      user.otpLastRequestAt &&
      now.getTime() - user.otpLastRequestAt.getTime() < 10 * 60 * 1000 &&
      (user.otpRequestCount || 0) >= 3
    ) {
      throw new Error("Too many OTP requests. Try again later.");
    }

    const { otp, expiresAt } = generateOTPData();

    await userRepository.updateByEmail(email, {
      otp,
      otpExpiresAt: expiresAt,
      otpRequestCount: (user.otpRequestCount || 0) + 1,
      otpLastRequestAt: now,
    });
    await sendOtpMail(email, otp);
  },

  // ---------- LOGIN ----------
  login: async (
    email: string,
    password: string
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (!user.isVerified) throw new Error("Please verify your account first");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const accessToken = createAccessToken({ id: user._id, role: user.role });
    const refreshToken = createRefreshToken({ id: user._id });

    await userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return { user, accessToken, refreshToken };
  },

 googleLogin: async (credential: string) => {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error("Invalid Google token");

    let user = await userRepository.findByEmail(payload.email);

    if (!user) {
      user = await userRepository.create({
        name: payload.name || "Google User",
        email: payload.email,
        authProvider: "google",
        role: "user",
        isVerified: true,
      });
    }

    const accessToken = createAccessToken({ id: user._id, role: user.role });
    const refreshToken = createRefreshToken({ id: user._id });

    await userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return { user, accessToken, refreshToken };
  },



  // ---------- REFRESH ----------
  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    if (!refreshToken) throw new Error("No refresh token");

    const payload = verifyRefreshToken(refreshToken) as { id: string };
    const user = await userRepository.findById(payload.id);

    if (!user) throw new Error("User not found");
    if (!user.refreshToken) throw new Error("User logged out");
    if (user.refreshToken !== refreshToken) throw new Error("Token mismatch");

    const newAccessToken = createAccessToken({
      id: user._id,
      role: user.role,
    });

    return { accessToken: newAccessToken };
  },

  // ---------- LOGOUT ----------
  logout: async (refreshToken: string): Promise<void> => {
    if (!refreshToken) throw new Error("No refresh token");

    const payload = verifyRefreshToken(refreshToken) as { id: string };
    const user = await userRepository.findById(payload.id);
    if (!user) return;

    if (user.refreshToken !== refreshToken) return;

    await userRepository.updateRefreshToken(user._id.toString(), "");
  },
  async forgotPassword(email: string) {
    const user = await User.findOne({ email });

    // SECURITY: Do not reveal user existence
    if (!user) {
      return;
    }

    // ❌ Google users cannot reset password
    if (user.authProvider !== "local") {
      throw new Error("Password reset not allowed for this account");
    }

    const otp = generateOTP();
    const expiresAt = otpExpiry();

    user.otp = otp;
    user.otpExpiresAt = expiresAt;
    await user.save();

    await sendOtpMail(user.email, otp);
  },

// src/modules/auth/authService.ts

async verifyForgotOtp(email: string, otp: string) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.authProvider !== "local") {
    throw new Error("Invalid account type");
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new Error("OTP not found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    throw new Error("OTP expired");
  }

  // OPTION A: clear OTP immediately
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
},

async resetPassword(email: string, newPassword: string) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.authProvider !== "local") {
    throw new Error("Invalid account type");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();
},



};

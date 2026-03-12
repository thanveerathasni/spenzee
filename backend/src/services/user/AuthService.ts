import { OAuth2Client } from "google-auth-library";
import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";

import { IUser } from "../../models/User.model";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { UnauthorizedError, BadRequestError } from "../../shared/errors/errors";
import { generateOtp, hashOtp, compareOtp } from "../../shared/utils/otp.util";
import { comparePasswords, hashPassword } from "../../shared/utils/password";
import { hashRefreshToken } from "../../shared/utils/refreshTokenHash";
import { generateResetToken, hashResetToken } from "../../shared/utils/resetPasswordToken";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/token.util";
import { IOtpRepository } from "../../types/repositories/IOtpRepository";
import { IUserRepository } from "../../types/repositories/user/IUserRepository";
import { IAuthService } from "../../types/services/user/IAuthService";
import { IMailService } from "../../types/services/IMailService";
import { IRefreshTokenRepository } from "../../types/repositories/IRefreshTokenRepository";
import { IResetPasswordRepository } from "../../types/repositories/IResetPasswordRepository";







@injectable()
export class AuthService implements IAuthService {
  private readonly oauthClient: OAuth2Client;

  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.OtpRepository)
    private readonly otpRepository: IOtpRepository,

    @inject(TYPES.MailService)
    private readonly mailService: IMailService,

    @inject(TYPES.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(TYPES.ResetPasswordRepository)
    private readonly resetPasswordRepository: IResetPasswordRepository,
  ) {
    this.oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  // ================= LOGIN =================
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const jwtPayload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const accessToken = createAccessToken(jwtPayload);
    const refreshToken = createRefreshToken(jwtPayload);

    await this.refreshTokenRepository.create({
      userId: user._id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken, user };
  }

  // ================= REFRESH TOKEN =================
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }> {
    if (!refreshToken || typeof refreshToken !== "string") {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
    }

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
    }

    const stored = await this.refreshTokenRepository.findValidTokenByHash(
      hashRefreshToken(refreshToken),
    );

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
    }

    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const newAccessToken = createAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const newRefreshToken = createRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    await this.refreshTokenRepository.create({
      userId: user._id,
      tokenHash: hashRefreshToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }

  // ================= SIGNUP =================
  async signup(email: string, password: string): Promise<void> {
    const exists = await this.userRepository.findByEmail(email);

    if (exists) {
      throw new BadRequestError(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await hashPassword(password);

    await this.userRepository.create({
      email,
      name: email.split("@")[0],
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    const otp = generateOtp();

    await this.otpRepository.create(
      email,
      await hashOtp(otp),
      new Date(Date.now() + 10 * 60 * 1000),
    );

    await this.mailService.sendOtp(email, otp);
  }

  // ================= VERIFY OTP =================
  async verifyOtp(email: string, otp: string): Promise<void> {
    const record = await this.otpRepository.findByEmail(email);

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    const valid = await compareOtp(otp, record.otpHash);

    if (!valid) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    await this.userRepository.verifyUser(email);
    await this.otpRepository.deleteByEmail(email);
  }

  // ================= RESEND OTP =================
  async resendOtp(email: string): Promise<void> {
    const otp = generateOtp();

    await this.otpRepository.updateOtp(
      email,
      await hashOtp(otp),
      new Date(Date.now() + 10 * 60 * 1000),
    );

    await this.mailService.sendOtp(email, otp);
  }

  // ================= FORGOT PASSWORD =================
  async forgotPassword(email: string): Promise<string | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return null;

    await this.resetPasswordRepository.deleteByUserId(user._id);

    const resetToken = generateResetToken();

    await this.resetPasswordRepository.create(
      user._id,
      hashResetToken(resetToken),
      new Date(Date.now() + 15 * 60 * 1000),
    );

    return resetToken;
  }

  async sendResetPasswordEmail(email: string, resetToken: string): Promise<void> {
    await this.mailService.sendResetPasswordEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const record = await this.resetPasswordRepository.findByTokenHash(hashResetToken(token));

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestError(ERROR_MESSAGES.AUTH.RESET_TOKEN_INVALID);
    }

    await this.userRepository.updatePassword(
      record.userId.toString(),
      await hashPassword(newPassword),
    );

    await this.resetPasswordRepository.deleteByUserId(record.userId);
    await this.refreshTokenRepository.revokeAllForUser(record.userId);
  }

  // ================= GOOGLE LOGIN =================
  async googleLogin(
    credential: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    let user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      user = await this.userRepository.create({
        email: payload.email,
        name: payload.name ?? payload.email.split("@")[0],
        password: null,
        role: "user",
        isVerified: true,
        provider: "google",
      });
    }

    const jwtPayload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const accessToken = createAccessToken(jwtPayload);
    const refreshToken = createRefreshToken(jwtPayload);

    await this.refreshTokenRepository.create({
      userId: user._id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken, user };
  }

  // ================= LOGOUT =================
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);

    await this.refreshTokenRepository.deleteByTokenHash(tokenHash);
  }
}

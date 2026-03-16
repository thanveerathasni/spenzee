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
import { IRefreshTokenRepository } from "../../types/repositories/IRefreshTokenRepository";
import { IResetPasswordRepository } from "../../types/repositories/IResetPasswordRepository";
import { IUserRepository } from "../../types/repositories/user/IUserRepository";

import { IMailService } from "../../types/services/IMailService";
import { IAuthService, AuthResponse } from "../../types/services/user/IAuthService";

import { AuthMapper } from "../../shared/mapper/AuthMapper";

@injectable()
export class AuthService implements IAuthService {
  private readonly _oauthClient: OAuth2Client;

  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.OtpRepository)
    private readonly _otpRepository: IOtpRepository,

    @inject(TYPES.MailService)
    private readonly _mailService: IMailService,

    @inject(TYPES.RefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,

    @inject(TYPES.ResetPasswordRepository)
    private readonly _resetPasswordRepository: IResetPasswordRepository,
  ) {
    this._oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this._userRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const valid = await comparePasswords(password, user.password);

    if (!valid) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    await this._refreshTokenRepository.create({
      userId: user._id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    if (!refreshToken) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
    }

    const payload = verifyRefreshToken(refreshToken);

    const stored = await this._refreshTokenRepository.findValidTokenByHash(
      hashRefreshToken(refreshToken),
    );

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
    }

    const user = await this._userRepository.findById(payload.userId);

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

    return AuthMapper.toAuthResponse(user, newAccessToken, newRefreshToken);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);
    await this._refreshTokenRepository.deleteByTokenHash(tokenHash);
  }

  async signup(email: string, password: string): Promise<void> {
    const exists = await this._userRepository.findByEmail(email);

    if (exists) {
      throw new BadRequestError(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await hashPassword(password);

    await this._userRepository.create({
      email,
      name: email.split("@")[0],
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    const otp = generateOtp();

    await this._otpRepository.create(
      email,
      await hashOtp(otp),
      new Date(Date.now() + 10 * 60 * 1000),
    );

    await this._mailService.sendOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const record = await this._otpRepository.findByEmail(email);

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    const valid = await compareOtp(otp, record.otpHash);

    if (!valid) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    await this._userRepository.verifyUser(email);
    await this._otpRepository.deleteByEmail(email);
  }

  async resendOtp(email: string): Promise<void> {
    const otp = generateOtp();

    await this._otpRepository.updateOtp(
      email,
      await hashOtp(otp),
      new Date(Date.now() + 10 * 60 * 1000),
    );

    await this._mailService.sendOtp(email, otp);
  }

  async forgotPassword(email: string): Promise<string | null> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) return null;

    const resetToken = generateResetToken();

    await this._resetPasswordRepository.create(
      user._id,
      hashResetToken(resetToken),
      new Date(Date.now() + 15 * 60 * 1000),
    );

    return resetToken;
  }

  async sendResetPasswordEmail(email: string, resetToken: string): Promise<void> {
    await this._mailService.sendResetPasswordEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const record = await this._resetPasswordRepository.findByTokenHash(
      hashResetToken(token),
    );

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestError(ERROR_MESSAGES.AUTH.RESET_TOKEN_INVALID);
    }

    await this._userRepository.updatePassword(
      record.userId.toString(),
      await hashPassword(newPassword),
    );
  }

  async googleLogin(credential: string): Promise<AuthResponse> {
    const ticket = await this._oauthClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    let user = await this._userRepository.findByEmail(payload.email);

    if (!user) {
      user = await this._userRepository.create({
        email: payload.email,
        name: payload.name ?? payload.email.split("@")[0],
        password: null,
        role: "user",
        isVerified: true,
        provider: "google",
      });
    }

    const accessToken = createAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }
}
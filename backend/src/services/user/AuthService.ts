import { OAuth2Client } from "google-auth-library";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";

import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { ROLES } from "../../shared/constants/roles";

import {
  BadRequestError,
  UnauthorizedError,
} from "../../shared/errors/errors";

import { AuthMapper } from "../../shared/mapper/AuthMapper";

import {
  compareOtp,
  generateOtp,
  getOtpExpiry,
  hashOtp,
  isOtpExpired,
} from "../../shared/utils/otpHash";

import {
  comparePasswords,
  hashPassword,
} from "../../shared/utils/password";

import { hashRefreshToken } from "../../shared/utils/refreshTokenHash";

import {
  generateResetToken,
  hashResetToken,
} from "../../shared/utils/resetPasswordToken";

import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/token.util";

import { IOtpRepository } from "../../types/repositories/IOtpRepository";

import { IRefreshTokenRepository } from "../../types/repositories/IRefreshTokenRepository";

import { IUserRepository } from "../../types/repositories/user/IUserRepository";

import { IMailService } from "../../types/services/IMailService";
import { logger } from "../../shared/logger/logger";
import {
  IAuthService,
  AuthResponse,
} from "../../types/services/user/IAuthService";

import { ResetPasswordRepository } from "../../repositories/ResetPasswordRepository";

@injectable()
export class AuthService
  implements IAuthService
{
  private readonly _oauthClient: OAuth2Client;

  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.OtpRepository)
    private readonly _otpRepository: IOtpRepository,

    @inject(TYPES.MailService)
    private readonly _mailService: IMailService,

    @inject(TYPES.RefreshTokenRepository)
    private readonly _refreshRepo: IRefreshTokenRepository,

    @inject(TYPES.ResetPasswordRepository)
    private readonly _resetPasswordRepository: ResetPasswordRepository,
  ) {
    this._oauthClient =
      new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
      );
  }

  /* ====================================================== */
  /* LOGIN */
  /* ====================================================== */

  async login(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const user =
      await this._userRepository.findByEmailWithPassword(
        email,
      );

    if (!user || !user.password) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.ACCOUNT_BLOCKED,
      );
    }

    const isValidPassword =
      await comparePasswords(
        password,
        user.password,
      );

    if (!isValidPassword) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      );
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const accessToken =
      createAccessToken(payload);

    const refreshToken =
      createRefreshToken(payload);

    await this._refreshRepo.create({
      userId: user._id,
      tokenHash:
        hashRefreshToken(refreshToken),
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000,
      ),
    });

    return AuthMapper.toAuthResponse(
      user,
      accessToken,
      refreshToken,
    );
  }

  /* ====================================================== */
  /* REFRESH TOKEN */
  /* ====================================================== */

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<AuthResponse> {
    const payload =
      verifyRefreshToken(refreshToken);

    const tokenHash =
      hashRefreshToken(refreshToken);

    const stored =
      await this._refreshRepo.findValidTokenByHash(
        tokenHash,
      );

    if (!stored) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .REFRESH_TOKEN_INVALID,
      );
    }

    const user =
      await this._userRepository.findById(
        payload.userId,
      );

    if (!user) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.USER_NOT_FOUND,
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.ACCOUNT_BLOCKED,
      );
    }

    const tokenPayload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const newAccessToken =
      createAccessToken(
        tokenPayload,
      );

    const newRefreshToken =
      createRefreshToken(
        tokenPayload,
      );

    await this._refreshRepo.deleteByTokenHash(
      tokenHash,
    );

    await this._refreshRepo.create({
      userId: user._id,
      tokenHash:
        hashRefreshToken(
          newRefreshToken,
        ),
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000,
      ),
    });

    return AuthMapper.toAuthResponse(
      user,
      newAccessToken,
      newRefreshToken,
    );
  }

  /* ====================================================== */
  /* LOGOUT */
  /* ====================================================== */

  async logout(
    refreshToken: string,
  ): Promise<void> {
    const tokenHash =
      hashRefreshToken(refreshToken);

    await this._refreshRepo.deleteByTokenHash(
      tokenHash,
    );
  }

  /* ====================================================== */
  /* SIGNUP */
  /* ====================================================== */

  async signup(
    email: string,
    password: string,
  ): Promise<void> {
    const existingUser =
      await this._userRepository.findByEmail(
        email,
      );

    if (existingUser) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .USER_ALREADY_EXISTS,
      );
    }

    const hashedPassword =
      await hashPassword(password);

    await this._userRepository.create({
      email,
      name: email.split("@")[0],
      password: hashedPassword,
      role: ROLES.USER,
      isVerified: false,
    });

    const otp = generateOtp();

    await this._otpRepository.updateOtp(
      email,
      hashOtp(otp),
      getOtpExpiry(),
    );

    await this._mailService.sendOtp(
      email,
      otp,
    );
  }

  /* ====================================================== */
  /* VERIFY OTP */
  /* ====================================================== */

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<void> {
    const record =
      await this._otpRepository.findByEmail(
        email,
      );

    if (!record) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.NO_OTP_FOUND,
      );
    }

    if (
      isOtpExpired(record.expiresAt)
    ) {
      await this._otpRepository.deleteByEmail(
        email,
      );

      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.OTP_EXPIRED,
      );
    }

    const isValidOtp = compareOtp(
      otp,
      record.otpHash,
    );

    if (!isValidOtp) {
      await this._otpRepository.incrementAttempts(
        email,
      );

      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.OTP_INVALID,
      );
    }

    await this._userRepository.verifyUser(
      email,
    );

    await this._otpRepository.deleteByEmail(
      email,
    );
  }

  /* ====================================================== */
  /* RESEND OTP */
  /* ====================================================== */

  async resendOtp(
    email: string,
  ): Promise<void> {
    const otp = generateOtp();

    await this._otpRepository.updateOtp(
      email,
      hashOtp(otp),
      getOtpExpiry(),
    );

    await this._mailService.sendOtp(
      email,
      otp,
    );
  }

  /* ====================================================== */
  /* FORGOT PASSWORD */
  /* ====================================================== */

  async forgotPassword(
    email: string,
  ): Promise<void> {
    const user =
      await this._userRepository.findByEmail(
        email,
      );

    if (!user) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH.USER_NOT_FOUND,
      );
    }

    const rawToken =
      generateResetToken();

    const hashedToken =
      hashResetToken(rawToken);

    await this._resetPasswordRepository.deleteByUserId(
      user._id,
    );

    await this._resetPasswordRepository.create(
      user._id,
      hashedToken,
      new Date(
        Date.now() +
          10 * 60 * 1000,
      ),
    );

    await this._mailService.sendResetPasswordEmail(
      email,
      rawToken,
    );
  }

  /* ====================================================== */
  /* RESET PASSWORD */
  /* ====================================================== */

async resetPassword(
  email: string,
  token: string,
  newPassword: string,
): Promise<void> {
  logger.warn("RESET DEBUG START", {
    incomingEmail: email,
    incomingToken: token,
  });

  const user =
    await this._userRepository.findByEmail(
      email,
    );

  logger.warn("RESET DEBUG USER", {
    foundUser: !!user,
    userId: user?._id,
  });

  if (!user) {
    throw new BadRequestError(
      ERROR_MESSAGES.AUTH.USER_NOT_FOUND,
    );
  }

  const normalizedToken =
    token.trim();

  const hashedToken =
    hashResetToken(
      normalizedToken,
    );

  logger.warn("RESET DEBUG HASH", {
    hashedToken,
  });

  const storedToken =
    await this._resetPasswordRepository.findValidToken(
      hashedToken,
    );

  logger.warn("RESET DEBUG STORED", {
    foundStoredToken:
      !!storedToken,

    storedUserId:
      storedToken?.userId?.toString(),

    expectedUserId:
      user._id.toString(),
  });

  if (
    !storedToken ||
    storedToken.userId.toString() !==
      user._id.toString()
  ) {
    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH
        .RESET_TOKEN_INVALID,
    );
  }

  if (
    storedToken.expiresAt <
    new Date()
  ) {
    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH
        .RESET_TOKEN_EXPIRED,
    );
  }

  const hashedPassword =
    await hashPassword(
      newPassword,
    );

  await this._userRepository.updatePassword(
    user._id.toString(),
    hashedPassword,
  );

  await this._resetPasswordRepository.deleteByUserId(
    user._id,
  );

  logger.warn("RESET DEBUG SUCCESS");
}

/* ====================================================== */
/* EMAIL CHANGE */
/* ====================================================== */

  async sendEmailChangeOtp(
    email: string,
  ): Promise<void> {
    const otp = generateOtp();

    await this._otpRepository.updateOtp(
      email,
      hashOtp(otp),
      getOtpExpiry(),
    );

    await this._mailService.sendOtp(
      email,
      otp,
    );
  }

  async verifyEmailChangeOtp(
    email: string,
    otp: string,
  ): Promise<void> {
    const record =
      await this._otpRepository.findByEmail(
        email,
      );

    if (!record) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.NO_OTP_FOUND,
      );
    }

    if (
      isOtpExpired(record.expiresAt)
    ) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.OTP_EXPIRED,
      );
    }

    const valid = compareOtp(
      otp,
      record.otpHash,
    );

    if (!valid) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.OTP_INVALID,
      );
    }

    await this._otpRepository.deleteByEmail(
      email,
    );
  }

  async updateEmail(
    userId: string,
    newEmail: string,
  ) {
    const existing =
      await this._userRepository.findByEmail(
        newEmail,
      );

    if (
      existing &&
      existing._id.toString() !==
        userId
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .EMAIL_ALREADY_IN_USE,
      );
    }

    const updated =
      await this._userRepository.updateById(
        userId,
        {
          email: newEmail,
        },
      );

    if (!updated) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.USER_NOT_FOUND,
      );
    }

    return AuthMapper.toUserDTO(
      updated,
    );
  }

  /* ====================================================== */
  /* PASSWORD CHANGE */
  /* ====================================================== */

  async sendPasswordOtp(
    userId: string,
  ): Promise<void> {
    const user =
      await this._userRepository.findById(
        userId,
      );

    if (!user) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.USER_NOT_FOUND,
      );
    }

    const otp = generateOtp();

    await this._otpRepository.updateOtp(
      user.email,
      hashOtp(otp),
      getOtpExpiry(),
    );

    await this._mailService.sendOtp(
      user.email,
      otp,
    );
  }

  async verifyPasswordOtp(
    userId: string,
    otp: string,
  ): Promise<void> {
    const user =
      await this._userRepository.findById(
        userId,
      );

    if (!user) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.USER_NOT_FOUND,
      );
    }

    const record =
      await this._otpRepository.findByEmail(
        user.email,
      );

    if (!record) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.NO_OTP_FOUND,
      );
    }

    if (
      isOtpExpired(record.expiresAt)
    ) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.OTP_EXPIRED,
      );
    }

    const valid = compareOtp(
      otp,
      record.otpHash,
    );

    if (!valid) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.OTP_INVALID,
      );
    }

    await this._otpRepository.deleteByEmail(
      user.email,
    );
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user =
      await this._userRepository.findByIdWithPassword(
        userId,
      );

    if (
      !user ||
      !user.password
    ) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.USER_NOT_FOUND,
      );
    }

    const valid =
      await comparePasswords(
        currentPassword,
        user.password,
      );

    if (!valid) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .CURRENT_PASSWORD_INVALID,
      );
    }

    const hashedPassword =
      await hashPassword(
        newPassword,
      );

    await this._userRepository.updatePassword(
      userId,
      hashedPassword,
    );
  }

  /* ====================================================== */
  /* GOOGLE LOGIN */
  /* ====================================================== */

  async googleLogin(
    credential: string,
  ): Promise<AuthResponse> {
    const ticket =
      await this._oauthClient.verifyIdToken(
        {
          idToken: credential,
          audience:
            process.env
              .GOOGLE_CLIENT_ID,
        },
      );

    const payload =
      ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .INVALID_CREDENTIALS,
      );
    }

    let user =
      await this._userRepository.findByEmail(
        payload.email,
      );

    if (!user) {
      user =
        await this._userRepository.create(
          {
            email: payload.email,
            name:
              payload.name ??
              payload.email.split(
                "@",
              )[0],
            password: null,
            role: ROLES.USER,
            isVerified: true,
            provider: "google",
          },
        );
    }

    const tokenPayload = {
      userId:
        user._id.toString(),
      role: user.role,
    };

    const accessToken =
      createAccessToken(
        tokenPayload,
      );

    const refreshToken =
      createRefreshToken(
        tokenPayload,
      );

    await this._refreshRepo.create({
      userId: user._id,
      tokenHash:
        hashRefreshToken(refreshToken),
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000,
      ),
    });

    return AuthMapper.toAuthResponse(
      user,
      accessToken,
      refreshToken,
    );
  }
}



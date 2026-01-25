import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";

import { IAuthService } from "../types/services/IAuthService";
import { IUserRepository } from "../types/repositories/IUserRepository";
import { IOtpRepository } from "../types/repositories/IOtpRepository";
import { IMailService } from "../types/services/IMailService";

import {
  UnauthorizedError,
  BadRequestError
} from "../utils/errors";

import { ERROR_MESSAGES } from "../constants/errorMessages";

import {
  comparePasswords,
  hashPassword
} from "../utils/password";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../utils/jwt";

import { generateOtp } from "../utils/otp";
import { hashOtp, compareOtp } from "../utils/otpHash";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.OtpRepository)
    private readonly otpRepository: IOtpRepository,

    @inject(TYPES.MailService)
    private readonly mailService: IMailService
  ) {}

  // ======================
  // LOGIN
  // ======================
  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
      );
    }

    const isPasswordValid = await comparePasswords(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
      );
    }

    if (!user.isVerified) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.ACCOUNT_NOT_VERIFIED
      );
    }

    const payload = {
      userId: user.id,
      role: user.role
    };

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload)
    };
  }

  // ======================
  // REFRESH TOKEN
  // ======================
  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    try {
      const payload = verifyRefreshToken(refreshToken);

      return {
        accessToken: generateAccessToken({
          userId: payload.userId,
          role: payload.role
        })
      };
    } catch {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID
      );
    }
  }

  // ======================
  // SIGNUP + OTP
  // ======================
  async signup(email: string, password: string): Promise<void> {
    const existingUser =
      await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS
      );
    }

    const hashedPassword = await hashPassword(password);

    await this.userRepository.create({
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false
    });

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000 // 10 minutes
    );

    await this.otpRepository.create(
      email,
      otpHash,
      expiresAt
    );

    await this.mailService.sendOtp(email, otp);
  }

  // ======================
  // VERIFY OTP
  // ======================
  async verifyOtp(email: string, otp: string): Promise<void> {
    const record =
      await this.otpRepository.findByEmail(email);

    if (!record) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.OTP_INVALID
      );
    }

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.OTP_EXPIRED
      );
    }

    const isMatch = await compareOtp(
      otp,
      record.otpHash
    );

    if (!isMatch) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.OTP_INVALID
      );
    }

    await this.userRepository.verifyUser(email);
    await this.otpRepository.deleteByEmail(email);
  }
}

import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";

import { IAuthService } from "../types/services/IAuthService";
import { IUserRepository } from "../types/repositories/IUserRepository";
import { IOtpRepository } from "../types/repositories/IOtpRepository";
import { IMailService } from "../types/services/IMailService";
import { IRefreshTokenRepository } from "../types/repositories/IRefreshTokenRepository";
import { hashRefreshToken } from "../utils/refreshTokenHash";
import { Types } from "mongoose";

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
    private readonly mailService: IMailService,

    @inject(TYPES.RefreshTokenRepository)
  private readonly refreshTokenRepository: IRefreshTokenRepository
 
 
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
      userId: user._id.toString(),
      role: user.role
    };

    const accessToken = generateAccessToken(payload);
const refreshToken = generateRefreshToken(payload);

// hash refresh token before storing
const refreshTokenHash = hashRefreshToken(refreshToken);

// refresh token expiry (7 days)
const refreshTokenExpiresAt = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000
);

await this.refreshTokenRepository.create({
  userId: user._id,
  tokenHash: refreshTokenHash,
  expiresAt: refreshTokenExpiresAt
});

return {
  accessToken,
  refreshToken
};

  }

  // ======================
  // REFRESH TOKEN
  // ======================
 async refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  // 1. Verify JWT signature & expiry
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID
    );
  }

  // 2. Hash incoming token
  const tokenHash = hashRefreshToken(refreshToken);

  // 3. Find token record in DB
  const storedToken =
    await this.refreshTokenRepository.findByTokenHash(tokenHash);

  // 4. Token not found → possible reuse attack
  if (!storedToken) {
    await this.refreshTokenRepository.revokeAllForUser(
      new Types.ObjectId(payload.userId)
    );

    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID
    );
  }

  // 5. Check expiration
  if (storedToken.expiresAt < new Date()) {
    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID
    );
  }

  // 6. Revoke old token (ROTATION)
  await this.refreshTokenRepository.revokeToken(
    storedToken._id
  );

  // 7. Issue NEW tokens
  const newAccessToken = generateAccessToken({
    userId: payload.userId,
    role: payload.role
  });

  const newRefreshToken = generateRefreshToken({
    userId: payload.userId,
    role: payload.role
  });

  // 8. Store new refresh token
  await this.refreshTokenRepository.create({
    userId: new Types.ObjectId(payload.userId),
    tokenHash: hashRefreshToken(newRefreshToken),
    expiresAt: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    )
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
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
async resendOtp(email: string): Promise<void> {
  const user = await this.userRepository.findByEmail(email);

  if (!user) {
    throw new BadRequestError(
      ERROR_MESSAGES.AUTH.USER_NOT_FOUND
    );
  }

  if (user.isVerified) {
    throw new BadRequestError(
      ERROR_MESSAGES.AUTH.ALREADY_VERIFIED
    );
  }

  const otpRecord = await this.otpRepository.findByEmail(email);

  if (!otpRecord) {
    throw new BadRequestError(
      ERROR_MESSAGES.AUTH.NO_OTP_FOUND
    );
  }

  const now = new Date();
  const FIFTEEN_MIN = 15 * 60 * 1000;

  const timeDiff =
    now.getTime() -
    new Date(otpRecord.firstRequestedAt).getTime();

  //  RESET WINDOW IF EXPIRED
  if (timeDiff >= FIFTEEN_MIN) {
    await this.otpRepository.resetAttempts(email);
    otpRecord.attempts = 0;
  }

  //  RATE LIMIT CHECK
  if (otpRecord.attempts >= 3) {
    throw new BadRequestError(
      ERROR_MESSAGES.AUTH.OTP_LIMIT_EXCEEDED
    );
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await this.otpRepository.updateOtp(
    email,
    otpHash,
    expiresAt
  );

  await this.otpRepository.incrementAttempts(email);

  await this.mailService.sendOtp(email, otp);
}


async logout(refreshToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(refreshToken);

  const storedToken =
    await this.refreshTokenRepository.findByTokenHash(tokenHash);

  if (!storedToken) {
    // already invalid / expired → nothing to do
    return;
  }

  await this.refreshTokenRepository.revokeToken(storedToken._id);
}


async logoutAll(userId: string): Promise<void> {
  await this.refreshTokenRepository.revokeAllForUser(
    new Types.ObjectId(userId)
  );
}

}




import {
  injectable,
  inject,
} from "inversify";

import { TYPES } from "../di/types";

import {
  ERROR_MESSAGES,
} from "../shared/constants/errorMessages";

import {
  LOG_MESSAGES,
} from "../shared/constants/logMessages";

import {
  BadRequestError,
  UnauthorizedError,
} from "../shared/errors/errors";

import { logger } from "../shared/logger/logger";

import {
  compareOtp,
  generateOtp,
  getOtpExpiry,
  hashOtp,
  isOtpExpired,
} from "../shared/utils/otpHash";

import { IOtpRepository } from "../types/repositories/IOtpRepository";

import { IMailService } from "../types/services/IMailService";

const MAX_ATTEMPTS = 5;

const RESEND_COOLDOWN_SECONDS = 60;

@injectable()
export class OtpService {
  constructor(
    @inject(TYPES.OtpRepository)
    private readonly _otpRepository: IOtpRepository,

    @inject(TYPES.MailService)
    private readonly _mailService: IMailService,
  ) {}

  /* ====================================================== */
  /* SEND OTP */
  /* ====================================================== */

  async sendOtp(
    email: string,
    mailService?: IMailService,
  ): Promise<void> {
    const existingOtp =
      await this._otpRepository.findByEmail(
        email,
      );

    if (existingOtp) {
      const cooldown =
        (
          Date.now() -
          existingOtp.createdAt.getTime()
        ) / 1000;

      if (
        cooldown <
        RESEND_COOLDOWN_SECONDS
      ) {
        throw new BadRequestError(
          ERROR_MESSAGES.AUTH
            .TOO_MANY_REQUESTS,
        );
      }

      await this._otpRepository.deleteByEmail(
        email,
      );
    }

    const otp =
      generateOtp();

    const hashedOtp =
      hashOtp(otp);

    await this._otpRepository.create(
      email,
      hashedOtp,
      getOtpExpiry(),
    );

    const emailService =
      mailService ??
      this._mailService;

    await emailService.sendOtp(
      email,
      otp,
    );

    logger.info(
      LOG_MESSAGES.EMAIL
        .OTP_SENT,
      {
        email,
      },
    );
  }

  /* ====================================================== */
  /* VERIFY OTP */
  /* ====================================================== */

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<boolean> {
    const otpRecord =
      await this._otpRepository.findByEmail(
        email,
      );

    if (!otpRecord) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .NO_OTP_FOUND,
      );
    }

    if (
      isOtpExpired(
        otpRecord.expiresAt,
      )
    ) {
      await this._otpRepository.deleteByEmail(
        email,
      );

      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .OTP_EXPIRED,
      );
    }

    if (
      otpRecord.attempts >=
      MAX_ATTEMPTS
    ) {
      await this._otpRepository.deleteByEmail(
        email,
      );

      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .TOO_MANY_REQUESTS,
      );
    }

    const validOtp =
      compareOtp(
        otp,
        otpRecord.otpHash,
      );

    if (!validOtp) {
      await this._otpRepository.incrementAttempts(
        email,
      );

      logger.warn(
        LOG_MESSAGES.AUTH
          .AUTHORIZATION_FAILED,
        {
          email,
        },
      );

      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .OTP_INVALID,
      );
    }

    await this._otpRepository.deleteByEmail(
      email,
    );

    logger.info(
      LOG_MESSAGES.AUTH
        .LOGIN_SUCCESS,
      {
        email,
      },
    );

    return true;
  }
}
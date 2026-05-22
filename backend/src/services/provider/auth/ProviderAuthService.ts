import crypto from "crypto";

import {
  inject,
  injectable,
} from "inversify";

import { TYPES } from "../../../di/types";

import {
  ProviderStatus,
} from "../../../models/Provider.model";

import {
  ERROR_MESSAGES,
} from "../../../shared/constants/errorMessages";

import {
  HTTP_STATUS,
} from "../../../shared/constants/httpStatus";

import {
  LOG_MESSAGES,
} from "../../../shared/constants/logMessages";

import {
  PROVIDER_ERROR_MESSAGES,
} from "../../../shared/constants/provider";

import {
  ROLES,
} from "../../../shared/constants/roles";

import { AppError } from "../../../shared/errors/AppError";

import { logger } from "../../../shared/logger/logger";

import {
  compareOtp,
  generateOtp,
  getOtpExpiry,
  hashOtp,
  isOtpExpired,
} from "../../../shared/utils/otpHash";

import {
  comparePasswords,
  hashPassword,
} from "../../../shared/utils/password";

import {
  createAccessToken,
  verifyAccessToken,
   createRefreshToken,
  verifyRefreshToken
} from "../../../shared/utils/token.util";

import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";

import { IProviderPasswordSetupTokenRepository } from "../../../types/repositories/provider/IProviderPasswordSetupTokenRepository";
import { IMailService } from "../../../types/services/IMailService";

@injectable()
export class ProviderAuthService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly _tokenRepository: IProviderPasswordSetupTokenRepository,

    @inject(TYPES.MailService)
    private readonly _mailService: IMailService,
  ) {}

  /* ====================================================== */
  /* LOGIN */
  /* ====================================================== */

  // async login(
  //   email: string,
  //   password: string,
  // ) {
  //   const provider =
  //     await this._providerRepository.findByEmail(
  //       email,
  //     );

  //   if (!provider) {
  //     throw new AppError(
  //       PROVIDER_ERROR_MESSAGES.NOT_FOUND,
  //       HTTP_STATUS.UNAUTHORIZED,
  //     );
  //   }

  //   if (!provider.password) {
  //     throw new AppError(
  //       PROVIDER_ERROR_MESSAGES.PASSWORD_NOT_SET,
  //       HTTP_STATUS.UNAUTHORIZED,
  //     );
  //   }

  //   if (
  //     provider.status !==
  //     ProviderStatus.ACTIVE
  //   ) {
  //     throw new AppError(
  //       PROVIDER_ERROR_MESSAGES.NOT_ACTIVE,
  //       HTTP_STATUS.FORBIDDEN,
  //     );
  //   }

  //   const validPassword =
  //     await comparePasswords(
  //       password,
  //       provider.password,
  //     );

  //   if (!validPassword) {
  //     throw new AppError(
  //       ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
  //       HTTP_STATUS.UNAUTHORIZED,
  //     );
  //   }

  //   const accessToken =
  //     createAccessToken({
  //       userId:
  //         provider._id.toString(),

  //       role: ROLES.PROVIDER,
  //     });

  //   const {
  //     password: _password,
  //     ...safeProvider
  //   } = provider.toObject();

  //   logger.info(
  //     LOG_MESSAGES.PROVIDER
  //       .LOGIN_ATTEMPT,
  //     {
  //       providerId:
  //         provider._id.toString(),
  //     },
  //   );

  //   return {
  //     accessToken,

  //     provider:
  //       safeProvider,
  //   };
  // }



  /* ====================================================== */
/* LOGIN */
/* ====================================================== */

async login(
  email: string,
  password: string,
) {
  const provider =
    await this._providerRepository.findByEmail(
      email,
    );

  if (!provider) {
    throw new AppError(
      PROVIDER_ERROR_MESSAGES.NOT_FOUND,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  if (!provider.password) {
    throw new AppError(
      PROVIDER_ERROR_MESSAGES.PASSWORD_NOT_SET,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  if (
    provider.status !==
    ProviderStatus.ACTIVE
  ) {
    throw new AppError(
      PROVIDER_ERROR_MESSAGES.NOT_ACTIVE,
      HTTP_STATUS.FORBIDDEN,
    );
  }

  const validPassword =
    await comparePasswords(
      password,
      provider.password,
    );

  if (!validPassword) {
    throw new AppError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  /* ============================================== */
  /* TOKENS */
  /* ============================================== */

  const payload = {
    userId:
      provider._id.toString(),

    role:
      ROLES.PROVIDER,
  };

  const accessToken =
    createAccessToken(
      payload,
    );

  const refreshToken =
    createRefreshToken(
      payload,
    );

  /* ============================================== */
  /* SAFE PROVIDER */
  /* ============================================== */

  const {
    password: _password,
    ...safeProvider
  } = provider.toObject();

  logger.info(
    LOG_MESSAGES.PROVIDER
      .LOGIN_ATTEMPT,
    {
      providerId:
        provider._id.toString(),
    },
  );

  return {
    accessToken,

    refreshToken,

    provider:
      safeProvider,
  };
}
  /* ====================================================== */
  /* SETUP PASSWORD */
  /* ====================================================== */

  async setupPassword(
    token: string,
    newPassword: string,
  ): Promise<void> {
    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const tokenRecord =
      await this._tokenRepository.findByTokenHash(
        hashedToken,
      );

    if (!tokenRecord) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.INVALID_SETUP_TOKEN,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (
      tokenRecord.expiresAt <
      new Date()
    ) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.SETUP_TOKEN_EXPIRED,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (tokenRecord.isUsed) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.SETUP_TOKEN_ALREADY_USED,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const hashedPassword =
      await hashPassword(
        newPassword,
      );

    await this._providerRepository.updatePassword(
      tokenRecord.providerId.toString(),
      hashedPassword,
    );

    await this._tokenRepository.markAsUsed(
      tokenRecord._id!.toString(),
    );

    logger.info(
      LOG_MESSAGES.PROVIDER
        .PASSWORD_SETUP,
      {
        providerId:
          tokenRecord.providerId.toString(),
      },
    );
  }

  /* ====================================================== */
/* REFRESH */
/* ====================================================== */

async refresh(
  refreshToken: string,
) {
  const payload =
    verifyRefreshToken(
      refreshToken,
    );

  const provider =
    await this._providerRepository.findById(
      payload.userId,
    );

  if (!provider) {
    throw new AppError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const accessToken =
    createAccessToken({
      userId:
        provider._id.toString(),

      role:
        ROLES.PROVIDER,
    });

  const {
    password: _password,
    ...safeProvider
  } = provider.toObject();

  return {
    accessToken,

    provider:
      safeProvider,
  };
}
  /* ====================================================== */
  /* FORGOT PASSWORD */
  /* ====================================================== */

  async forgotPassword(
    email: string,
  ): Promise<void> {
    const provider =
      await this._providerRepository.findByEmail(
        email,
      );

    if (!provider) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const otp =
      generateOtp();

    const hashedOtp =
      hashOtp(otp);

    await this._tokenRepository.create({
      providerId:
        provider._id,

      hashedToken:
        hashedOtp,

      expiresAt:
        getOtpExpiry(10),

      isUsed: false,
    });

    await this._mailService.sendProviderResetPasswordEmail(
      email,
      otp,
    );

    logger.info(
      LOG_MESSAGES.EMAIL
        .RESET_PASSWORD_SENT,
      {
        providerId:
          provider._id.toString(),
      },
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
    const provider =
      await this._providerRepository.findByEmail(
        email,
      );

    if (!provider) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const records =
      await this._tokenRepository.findByProviderId(
        provider._id.toString(),
      );

    const latestToken =
      records[0];

    if (!latestToken) {
      throw new AppError(
        ERROR_MESSAGES.AUTH.RESET_TOKEN_INVALID,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (
      isOtpExpired(
        latestToken.expiresAt,
      )
    ) {
      throw new AppError(
        ERROR_MESSAGES.AUTH.RESET_TOKEN_EXPIRED,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (latestToken.isUsed) {
      throw new AppError(
        ERROR_MESSAGES.AUTH.RESET_TOKEN_INVALID,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const validToken =
      compareOtp(
        token,
        latestToken.hashedToken,
      );

    if (!validToken) {
      throw new AppError(
        ERROR_MESSAGES.AUTH.RESET_TOKEN_INVALID,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const hashedPassword =
      await hashPassword(
        newPassword,
      );

    await this._providerRepository.updatePassword(
      provider._id.toString(),
      hashedPassword,
    );

    await this._tokenRepository.markAsUsed(
      latestToken._id!.toString(),
    );

    logger.info(
      LOG_MESSAGES.PROVIDER
        .PASSWORD_CHANGE,
      {
        providerId:
          provider._id.toString(),
      },
    );
  }

  /* ====================================================== */
  /* CHANGE PASSWORD */
  /* ====================================================== */

  async changePassword(
    providerId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const provider =
      await this._providerRepository.findByIdWithPassword(
        providerId,
      );

    if (
      !provider ||
      !provider.password
    ) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const validPassword =
      await comparePasswords(
        oldPassword,
        provider.password,
      );

    if (!validPassword) {
      throw new AppError(
        ERROR_MESSAGES.AUTH.INVALID_OLD_PASSWORD,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const hashedPassword =
      await hashPassword(
        newPassword,
      );

    await this._providerRepository.updatePassword(
      providerId,
      hashedPassword,
    );

    logger.info(
      LOG_MESSAGES.PROVIDER
        .PASSWORD_CHANGE,
      {
        providerId,
      },
    );
  }
}
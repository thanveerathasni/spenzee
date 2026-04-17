import crypto from "crypto";
import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../di/types";
import { ProviderStatus } from "../../../models/Provider.model";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { LOG_MESSAGES } from "../../../shared/constants/logMessages";
import { PROVIDER_ERROR_MESSAGES } from "../../../shared/constants/provider";
import { ROLES } from "../../../shared/constants/roles";
import { AppError } from "../../../shared/errors/AppError";
import { logger } from "../../../shared/logger/logger";
import { createAccessToken } from "../../../shared/utils/token.util";

import { IProviderPasswordSetupTokenRepository } from "../../../types/repositories/provider/IProviderPasswordSetupTokenRepository";
import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";

@injectable()
export class ProviderAuthService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly _tokenRepository: IProviderPasswordSetupTokenRepository
  ) {}

  /* ================= LOGIN ================= */

  async login(email: string, password: string) {
    logger.info(LOG_MESSAGES.PROVIDER.LOGIN_ATTEMPT, { email });

    const provider = await this._providerRepository.findByEmail(email);

    if (!provider || !provider.password) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    //  STATUS CHECK 
    if (provider.status === ProviderStatus.PENDING) {
      throw new AppError("Account pending approval", 403);
    }

    if (provider.status === ProviderStatus.REJECTED) {
      throw new AppError("Account rejected", 403);
    }

    if (provider.status === ProviderStatus.SUSPENDED) {
      throw new AppError("Account suspended", 403);
    }

    const valid = await bcrypt.compare(password, provider.password);

    if (!valid) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const accessToken = createAccessToken({
      userId: provider._id.toString(),
      role: ROLES.PROVIDER,
    });

    return {
      accessToken,
      provider,
    };
  }

  /* ================= SETUP PASSWORD ================= */

  async setupPassword(token: string, password: string): Promise<void> {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const record = await this._tokenRepository.findByTokenHash(
      hashedToken
    );

    if (!record) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.INVALID_SETUP_TOKEN,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (record.expiresAt < new Date()) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.SETUP_TOKEN_EXPIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this._providerRepository.updatePassword(
      record.providerId.toString(),
      hashedPassword
    );

    await this._tokenRepository.markAsUsed(
      record._id!.toString()
    );
  }

  /* ================= CHANGE PASSWORD ================= */

  async changePassword(
    providerId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const provider = await this._providerRepository.findById(
      providerId
    );

    if (!provider || !provider.password) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const valid = await bcrypt.compare(
      oldPassword,
      provider.password
    );

    if (!valid) {
      throw new AppError(
        "Invalid old password",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await this._providerRepository.updatePassword(
      providerId,
      hashedNewPassword
    );
  }
}
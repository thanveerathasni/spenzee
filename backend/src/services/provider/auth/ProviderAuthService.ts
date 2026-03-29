import crypto from "crypto";
import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../di/types";

import { PROVIDER_ERROR_MESSAGES } from "../../../shared/constants/provider";
import { AppError } from "../../../shared/errors/AppError";
import { logger } from "../../../shared/logger/logger";

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

  async login(email: string, password: string) {
    logger.info("Provider login attempt", { email });

    const provider = await this._providerRepository.findByEmail(email);

    if (!provider || !provider.password) {
      throw new AppError(PROVIDER_ERROR_MESSAGES.NOT_FOUND, 401);
    }

    const valid = await bcrypt.compare(password, provider.password);

    if (!valid) {
      throw new AppError(PROVIDER_ERROR_MESSAGES.NOT_FOUND, 401);
    }

    return provider;
  }

  async setupPassword(token: string, password: string): Promise<void> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const record = await this._tokenRepository.findByTokenHash(hashedToken);

    if (!record) {
      throw new AppError(PROVIDER_ERROR_MESSAGES.INVALID_SETUP_TOKEN, 400);
    }

    if (record.expiresAt < new Date()) {
      throw new AppError(PROVIDER_ERROR_MESSAGES.SETUP_TOKEN_EXPIRED, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this._providerRepository.updatePassword(
      record.providerId.toString(),
      hashedPassword
    );

    await this._tokenRepository.markAsUsed(record._id!.toString());
  }
}
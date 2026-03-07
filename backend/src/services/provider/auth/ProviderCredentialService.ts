import { inject, injectable } from "inversify";
import crypto from "crypto";

import { TYPES } from "../../../di/types";
import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";
import { IProviderPasswordSetupTokenRepository } from "../../../types/repositories/provider/IProviderPasswordSetupTokenRepository";

import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { PROVIDER_ERROR_MESSAGES } from "../../../shared/constants/provider";
import { hashPassword } from "../../../shared/utils/password";

@injectable()
export class ProviderCredentialService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly providerRepository: IProviderRepository,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly passwordSetupTokenRepository: IProviderPasswordSetupTokenRepository
  ) {}

  async setupPassword(
    rawToken: string,
    newPassword: string
  ): Promise<void> {
    if (!rawToken || !newPassword) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.TOKEN_AND_PASSWORD_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Hash incoming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const tokenRecord =
      await this.passwordSetupTokenRepository.findByHashedToken(
        hashedToken
      );

    if (!tokenRecord) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.INVALID_SETUP_TOKEN,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (tokenRecord.expiresAt.getTime() < Date.now()) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.SETUP_TOKEN_EXPIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (tokenRecord.isUsed) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.SETUP_TOKEN_ALREADY_USED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const provider = await this.providerRepository.findById(
      tokenRecord.providerId.toString()
    );

    if (!provider) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (provider.password) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.PASSWORD_ALREADY_SET,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.providerRepository.updatePassword(
      provider._id.toString(),
      hashedPassword
    );

    await this.passwordSetupTokenRepository.markAsUsed(
      tokenRecord._id.toString()
    );
  }
}
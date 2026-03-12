import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../di/types";
import { ProviderStatus } from "../../../models/Provider.model";

import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { PROVIDER_ERROR_MESSAGES } from "../../../shared/constants/provider";
import { ROLES } from "../../../shared/constants/roles";
import { AppError } from "../../../shared/errors/AppError";
import { createAccessToken } from "../../../shared/utils/token.util";
import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";

interface ProviderLoginResult {
  accessToken: string;
  provider: {
    id: string;
    email: string;
    brandName: string;
  };
}

@injectable()
export class ProviderAuthService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly providerRepository: IProviderRepository,
  ) {}

  async login(email: string, password: string): Promise<ProviderLoginResult> {
    const provider = await this.providerRepository.findByEmail(email);

    if (!provider) {
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    if (provider.status !== ProviderStatus.ACTIVE) {
      throw new AppError(PROVIDER_ERROR_MESSAGES.NOT_ACTIVE, HTTP_STATUS.FORBIDDEN);
    }

    if (!provider.password) {
      throw new AppError(PROVIDER_ERROR_MESSAGES.PASSWORD_NOT_SET, HTTP_STATUS.BAD_REQUEST);
    }

    const isPasswordValid = await bcrypt.compare(password, provider.password);

    if (!isPasswordValid) {
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const accessToken = createAccessToken({
      userId: provider._id.toString(),
      role: ROLES.PROVIDER,
    });

    return {
      accessToken,
      provider: {
        id: provider._id.toString(),
        email: provider.email,
        brandName: provider.brandName,
      },
    };
  }
}

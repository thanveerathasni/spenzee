import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";

import { TYPES } from "../../../di/types";
import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";
import { ProviderStatus } from "../../../models/Provider.model";

import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { PROVIDER_ERROR_MESSAGES } from "../../../shared/constants/provider";
import { ROLES } from "../../../shared/constants/roles";
import { createAccessToken } from "../../../shared/utils/token.util";

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

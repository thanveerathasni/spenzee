import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { TYPES } from "../../../di/types";
import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";
import { ProviderStatus } from "../../../models/Provider.model";

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
    private readonly providerRepository: IProviderRepository
  ) {}

  async login(
    email: string,
    password: string
  ): Promise<ProviderLoginResult> {
    const provider = await this.providerRepository.findByEmail(email);

    if (!provider) {
      throw new Error("Invalid email or password");
    }

    if (provider.status !== ProviderStatus.ACTIVE) {
      throw new Error("Provider account is not active");
    }

    if (!provider.password) {
      throw new Error("Provider password not set");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      provider.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const accessToken = jwt.sign(
      {
        providerId: provider.id,
        role: "provider",
      },
      process.env.JWT_PROVIDER_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    return {
      accessToken,
      provider: {
        id: provider.id,
        email: provider.email,
        brandName: provider.brandName,
      },
    };
  }
}

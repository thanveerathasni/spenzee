import { injectable } from "inversify";
import { Types } from "mongoose";

import {
  ProviderPasswordSetupTokenModel,
  IProviderPasswordSetupToken,
} from "../../../models/ProviderPasswordSetupToken.model";

import { IProviderPasswordSetupTokenRepository } from "../../../types/repositories/provider/IProviderPasswordSetupTokenRepository";

@injectable()
export class ProviderPasswordSetupTokenRepository
  implements IProviderPasswordSetupTokenRepository
{
  async create(data: {
    providerId: Types.ObjectId;
    hashedToken: string;
    expiresAt: Date;
  }): Promise<IProviderPasswordSetupToken> {
    return ProviderPasswordSetupTokenModel.create(data);
  }

  async findByHashedToken(
    hashedToken: string
  ): Promise<IProviderPasswordSetupToken | null> {
    return ProviderPasswordSetupTokenModel.findOne({
      hashedToken,
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await ProviderPasswordSetupTokenModel.findByIdAndUpdate(id, {
      isUsed: true,
    });
  }
}
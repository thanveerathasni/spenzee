import { Types } from "mongoose";
import { IProviderPasswordSetupToken } from "../../../models/ProviderPasswordSetupToken.model";

export interface IProviderPasswordSetupTokenRepository {
  create(data: {
    providerId: Types.ObjectId;
    hashedToken: string;
    expiresAt: Date;
  }): Promise<IProviderPasswordSetupToken>;

  findByHashedToken(hashedToken: string): Promise<IProviderPasswordSetupToken | null>;

  markAsUsed(id: string): Promise<void>;

  deleteByProviderId(providerId: string): Promise<void>;
}

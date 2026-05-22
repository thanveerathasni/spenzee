import { Types } from "mongoose";

export interface ProviderPasswordSetupTokenEntity {
  _id?: Types.ObjectId;
  providerId: Types.ObjectId;
  hashedToken: string;
  expiresAt: Date;
  isUsed?: boolean;
  createdAt?: Date;
}

export interface IProviderPasswordSetupTokenRepository {
  create(data: ProviderPasswordSetupTokenEntity): Promise<ProviderPasswordSetupTokenEntity>;

  findByTokenHash(tokenHash: string): Promise<ProviderPasswordSetupTokenEntity | null>;

  findByHashedToken(tokenHash: string): Promise<ProviderPasswordSetupTokenEntity | null>;

  deleteByTokenHash(tokenHash: string): Promise<void>;

  markAsUsed(id: string): Promise<void>;
  
    findByProviderId(
    providerId: string
  ): Promise<ProviderPasswordSetupTokenEntity[]>;
}
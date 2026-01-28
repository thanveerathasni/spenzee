import { Types } from "mongoose";
import type { IRefreshToken } from "../../models/RefreshToken.model";

export interface IRefreshTokenRepository {
  create(data: {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;

  findByTokenHash(tokenHash: string): Promise<{
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    isRevoked: boolean;
    expiresAt: Date;
  } | null>;

    findValidTokenByHash(
    tokenHash: string
  ): Promise<IRefreshToken | null>;
deleteByTokenHash(tokenHash: string): Promise<void>;

  revokeToken(tokenId: Types.ObjectId): Promise<void>;

  revokeAllForUser(userId: Types.ObjectId): Promise<void>;
}

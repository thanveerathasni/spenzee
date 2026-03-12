import { Types } from "mongoose";
import { IRefreshToken } from "../../models/RefreshToken.model";

export interface IRefreshTokenRepository {
  create(data: { userId: Types.ObjectId; tokenHash: string; expiresAt: Date }): Promise<void>;

  findByTokenHash(tokenHash: string): Promise<IRefreshToken | null>;

  findValidTokenByHash(tokenHash: string): Promise<IRefreshToken | null>;

  deleteByTokenHash(tokenHash: string): Promise<void>;

  revokeToken(tokenId: Types.ObjectId): Promise<void>;

  revokeAllForUser(userId: Types.ObjectId): Promise<void>;
}

import { injectable } from "inversify";
import { Types } from "mongoose";
import { IRefreshTokenRepository } from "../types/repositories/IRefreshTokenRepository";
import { RefreshTokenModel } from "../models/RefreshToken.model";

@injectable()
export class RefreshTokenRepository
  implements IRefreshTokenRepository
{
  async create(data: {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await RefreshTokenModel.create(data);
  }

  async findByTokenHash(tokenHash: string) {
    return RefreshTokenModel.findOne({
      tokenHash,
      isRevoked: false
    }).lean();
  }

  async revokeToken(tokenId: Types.ObjectId): Promise<void> {
    await RefreshTokenModel.updateOne(
      { _id: tokenId },
      { isRevoked: true }
    );
  }

  async revokeAllForUser(
    userId: Types.ObjectId
  ): Promise<void> {
    await RefreshTokenModel.updateMany(
      { userId },
      { isRevoked: true }
    );
  }
}

import { injectable } from "inversify";
import { Types } from "mongoose";
import { RefreshTokenModel, IRefreshToken } from "../models/RefreshToken.model";

@injectable()
export class RefreshTokenRepository {
  async create(data: { userId: Types.ObjectId; tokenHash: string; expiresAt: Date }) {
    await RefreshTokenModel.create({
      ...data,
      isRevoked: false,
    });
  }

  async findByTokenHash(tokenHash: string): Promise<IRefreshToken | null> {
    return RefreshTokenModel.findOne({ tokenHash });
  }

  async findValidTokenByHash(tokenHash: string): Promise<IRefreshToken | null> {
    return RefreshTokenModel.findOne({
      tokenHash,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await RefreshTokenModel.deleteOne({ tokenHash });
  }

  async revokeToken(tokenId: Types.ObjectId): Promise<void> {
    await RefreshTokenModel.findByIdAndUpdate(tokenId, {
      isRevoked: true,
    });
  }

  async revokeAllForUser(userId: Types.ObjectId): Promise<void> {
    await RefreshTokenModel.updateMany(
      { userId },
      { isRevoked: true }
    );
  }
}
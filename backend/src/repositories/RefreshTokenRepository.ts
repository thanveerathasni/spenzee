import { injectable } from "inversify";
import { RefreshTokenModel } from "../models/RefreshToken.model";

@injectable()
export class RefreshTokenRepository {
  async create(data: any) {
    return RefreshTokenModel.create(data);
  }

  async findValidTokenByHash(tokenHash: string) {
    return RefreshTokenModel.findOne({ tokenHash });
  }

  async deleteByTokenHash(tokenHash: string) {
    await RefreshTokenModel.deleteOne({ tokenHash });
  }

  async revokeAllForUser(userId: string) {
    await RefreshTokenModel.deleteMany({ userId });
  }
}
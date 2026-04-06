import { injectable } from "inversify";
import { Types } from "mongoose";
import { ResetPasswordTokenModel } from "../models/ResetPasswordToken.model";

@injectable()
export class ResetPasswordRepository {
  async create(userId: string | Types.ObjectId, tokenHash: string, expiresAt: Date) {
    return ResetPasswordTokenModel.create({ userId, tokenHash, expiresAt });
  }

  async findByTokenHash(tokenHash: string) {
    return ResetPasswordTokenModel.findOne({ tokenHash });
  }
}

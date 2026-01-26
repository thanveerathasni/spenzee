import { injectable } from "inversify";
import { Types } from "mongoose";
import { IResetPasswordRepository } from "../types/repositories/IResetPasswordRepository";
import {
  ResetPasswordTokenModel
} from "../models/ResetPasswordToken.model";

@injectable()
export class ResetPasswordRepository
  implements IResetPasswordRepository {

  async create(
    userId: Types.ObjectId,
    tokenHash: string,
    expiresAt: Date
  ): Promise<void> {
    await ResetPasswordTokenModel.create({
      userId,
      tokenHash,
      expiresAt
    });
  }

  async findByTokenHash(
    tokenHash: string
  ) {
    return ResetPasswordTokenModel.findOne({
      tokenHash
    }).exec();
  }

  async deleteByUserId(
    userId: Types.ObjectId
  ): Promise<void> {
    await ResetPasswordTokenModel.deleteMany({
      userId
    });
  }
}

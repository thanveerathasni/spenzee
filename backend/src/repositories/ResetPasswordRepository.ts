// import { injectable } from "inversify";
// import { Types } from "mongoose";
// import { ResetPasswordTokenModel } from "../models/ResetPasswordToken.model";

// @injectable()
// export class ResetPasswordRepository {
//   async create(userId: string | Types.ObjectId, tokenHash: string, expiresAt: Date) {
//     return ResetPasswordTokenModel.create({ userId, tokenHash, expiresAt });
//   }

//   async findByTokenHash(tokenHash: string) {
//     return ResetPasswordTokenModel.findOne({ tokenHash });
//   }
// }






import { injectable } from "inversify";

import { Types } from "mongoose";

import {
  ResetPasswordTokenModel,
  IResetPasswordToken,
} from "../models/ResetPasswordToken.model";

@injectable()
export class ResetPasswordRepository {
  async create(
    userId: Types.ObjectId,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<IResetPasswordToken> {
    return ResetPasswordTokenModel.create({
      userId,
      tokenHash,
      expiresAt,
    });
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<IResetPasswordToken | null> {
    return ResetPasswordTokenModel.findOne({
      tokenHash,
    }).exec();
  }

  async findValidToken(
    tokenHash: string,
  ): Promise<IResetPasswordToken | null> {
    return ResetPasswordTokenModel.findOne({
      tokenHash,

      expiresAt: {
        $gt: new Date(),
      },
    }).exec();
  }

  async deleteByTokenHash(
    tokenHash: string,
  ): Promise<void> {
    await ResetPasswordTokenModel.deleteOne({
      tokenHash,
    }).exec();
  }

  async deleteByUserId(
    userId: Types.ObjectId,
  ): Promise<void> {
    await ResetPasswordTokenModel.deleteMany({
      userId,
    }).exec();
  }
}
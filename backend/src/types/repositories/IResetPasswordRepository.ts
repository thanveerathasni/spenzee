import { Types } from "mongoose";
import { IResetPasswordToken } from "../../models/ResetPasswordToken.model";

export interface IResetPasswordRepository {
  create(
    userId: Types.ObjectId,
    tokenHash: string,
    expiresAt: Date
  ): Promise<void>;

  findByTokenHash(
    tokenHash: string
  ): Promise<IResetPasswordToken | null>;

  deleteByUserId(userId: Types.ObjectId): Promise<void>;
}

import { injectable } from "inversify";
import { Types } from "mongoose";

import { ProviderPasswordSetupTokenModel } from "../../../models/ProviderPasswordSetupToken.model";

import {
  IProviderPasswordSetupTokenRepository,
  ProviderPasswordSetupTokenEntity,
} from "../../../types/repositories/provider/IProviderPasswordSetupTokenRepository";

@injectable()
export class ProviderPasswordSetupTokenRepository
  implements IProviderPasswordSetupTokenRepository
{
  async create(data: ProviderPasswordSetupTokenEntity): Promise<ProviderPasswordSetupTokenEntity> {
    const doc = await ProviderPasswordSetupTokenModel.create(data);

    return {
      _id: doc._id as Types.ObjectId,
      providerId: doc.providerId as Types.ObjectId,
      hashedToken: doc.hashedToken,
      expiresAt: doc.expiresAt,
      isUsed: doc.isUsed,
      createdAt: doc.createdAt,
    };
  }

  async findByProviderId(
  providerId: string
): Promise<ProviderPasswordSetupTokenEntity[]> {

  const docs =
    await ProviderPasswordSetupTokenModel
      .find({
        providerId,
        isUsed: false,
      })
      .sort({ createdAt: -1 });

  return docs.map((doc) => ({
    _id: doc._id as Types.ObjectId,

    providerId: doc.providerId as Types.ObjectId,

    hashedToken: doc.hashedToken,

    expiresAt: doc.expiresAt,

    isUsed: doc.isUsed,

    createdAt: doc.createdAt,
  }));
}


  async findByTokenHash(tokenHash: string): Promise<ProviderPasswordSetupTokenEntity | null> {
    const doc = await ProviderPasswordSetupTokenModel.findOne({
      hashedToken: tokenHash,
      isUsed: false,
    }).exec();

    if (!doc) return null;

    return {
      _id: doc._id as Types.ObjectId,
      providerId: doc.providerId as Types.ObjectId,
      hashedToken: doc.hashedToken,
      expiresAt: doc.expiresAt,
      isUsed: doc.isUsed,
    };
  }

  async findByHashedToken(tokenHash: string) {
    return this.findByTokenHash(tokenHash);
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await ProviderPasswordSetupTokenModel.deleteOne({
      hashedToken: tokenHash,
    }).exec();
  }

  async markAsUsed(id: string): Promise<void> {
    await ProviderPasswordSetupTokenModel.findByIdAndUpdate(id, {
      isUsed: true,
    }).exec();
  }
}
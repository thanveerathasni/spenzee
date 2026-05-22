import { injectable } from "inversify";
import { Types } from "mongoose";
import { AddressModel, IAddress } from "../../models/Address.model";
import { BaseRepository } from "../../shared/base/BaseRepository";
import {
  CreateAddressData,
  IAddressRepository,
  UpdateAddressData,
} from "../../types/repositories/user/IAddressRepository";

@injectable()
export class AddressRepository
  extends BaseRepository<IAddress>
  implements IAddressRepository
{
  constructor() {
    super(AddressModel);
  }

  async create(data: CreateAddressData): Promise<IAddress> {
    return super.create(data);
  }

  async findByUserId(userId: string): Promise<IAddress[]> {
    return this.model.find({ userId }).sort({ isPrimary: -1, createdAt: -1 }).exec();
  }

  async findByIdForUser(addressId: string, userId: string): Promise<IAddress | null> {
    if (!Types.ObjectId.isValid(addressId)) return null;
    return this.model.findOne({ _id: addressId, userId }).exec();
  }

  async findPrimaryByUserId(userId: string): Promise<IAddress | null> {
    return this.model.findOne({ userId, isPrimary: true }).exec();
  }

  async updateByIdForUser(
    addressId: string,
    userId: string,
    data: UpdateAddressData,
  ): Promise<IAddress | null> {
    if (!Types.ObjectId.isValid(addressId)) return null;
    return this.model
      .findOneAndUpdate({ _id: addressId, userId }, data, { new: true })
      .exec();
  }

  async unsetPrimaryForUser(userId: string): Promise<void> {
    await this.model.updateMany({ userId }, { isPrimary: false }).exec();
  }

  async deleteByIdForUser(addressId: string, userId: string): Promise<IAddress | null> {
    if (!Types.ObjectId.isValid(addressId)) return null;
    return this.model.findOneAndDelete({ _id: addressId, userId }).exec();
  }

  async countByUserId(userId: string): Promise<number> {
    return this.model.countDocuments({ userId }).exec();
  }
}

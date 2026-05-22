import { Types } from "mongoose";
import { AddressType, IAddress } from "../../../models/Address.model";

export interface CreateAddressData {
  userId: Types.ObjectId;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  houseName: string;
  street: string;
  city: string;
  district: string;
  state: string;
  country: string;
  postalCode: string;
  landmark?: string;
  addressType: AddressType;
  isPrimary: boolean;
}

export type UpdateAddressData = Partial<Omit<CreateAddressData, "userId">>;

export interface IAddressRepository {
  create(data: CreateAddressData): Promise<IAddress>;
  findByUserId(userId: string): Promise<IAddress[]>;
  findByIdForUser(addressId: string, userId: string): Promise<IAddress | null>;
  findPrimaryByUserId(userId: string): Promise<IAddress | null>;
  updateByIdForUser(
    addressId: string,
    userId: string,
    data: UpdateAddressData,
  ): Promise<IAddress | null>;
  unsetPrimaryForUser(userId: string): Promise<void>;
  deleteByIdForUser(addressId: string, userId: string): Promise<IAddress | null>;
  countByUserId(userId: string): Promise<number>;
}

import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../di/types";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { AddressDTO } from "../../shared/dto/user/address.dto";
import { BadRequestError } from "../../shared/errors/errors";
import { logger } from "../../shared/logger/logger";
import { AddressMapper } from "../../shared/mapper/user/AddressMapper";
import {
  IAddressRepository,
  UpdateAddressData,
} from "../../types/repositories/user/IAddressRepository";
import { AddressPayload, UpdateAddressPayload } from "../../validators/address.validator";

@injectable()
export class AddressService {
  constructor(
    @inject(TYPES.AddressRepository)
    private readonly _addressRepository: IAddressRepository,
  ) {}

  async list(userId: string): Promise<AddressDTO[]> {
    const addresses = await this._addressRepository.findByUserId(userId);
    return addresses.map(AddressMapper.toDTO);
  }

  async getPrimary(userId: string): Promise<AddressDTO | null> {
    const address = await this._addressRepository.findPrimaryByUserId(userId);
    return address ? AddressMapper.toDTO(address) : null;
  }

  async create(userId: string, data: AddressPayload): Promise<AddressDTO> {
    const addressCount = await this._addressRepository.countByUserId(userId);
    const shouldBePrimary = data.isPrimary === true || addressCount === 0;

    if (shouldBePrimary) {
      await this._addressRepository.unsetPrimaryForUser(userId);
    }

    const address = await this._addressRepository.create({
      ...data,
      userId: new Types.ObjectId(userId),
      isPrimary: shouldBePrimary,
    });

    logger.info(LOG_MESSAGES.USER.ADDRESS_CREATED, { userId, addressId: address._id.toString() });
    return AddressMapper.toDTO(address);
  }

  async update(
    userId: string,
    addressId: string,
    data: UpdateAddressPayload,
  ): Promise<AddressDTO> {
    if (data.isPrimary === true) {
      await this._addressRepository.unsetPrimaryForUser(userId);
    }

    const updated = await this._addressRepository.updateByIdForUser(
      addressId,
      userId,
      data as UpdateAddressData,
    );

    if (!updated) {
      throw new BadRequestError(ERROR_MESSAGES.USER.ADDRESS_NOT_FOUND);
    }

    logger.info(LOG_MESSAGES.USER.ADDRESS_UPDATED, { userId, addressId });
    return AddressMapper.toDTO(updated);
  }

  async delete(userId: string, addressId: string): Promise<void> {
    const deleted = await this._addressRepository.deleteByIdForUser(addressId, userId);

    if (!deleted) {
      throw new BadRequestError(ERROR_MESSAGES.USER.ADDRESS_NOT_FOUND);
    }

    if (deleted.isPrimary) {
      const remaining = await this._addressRepository.findByUserId(userId);
      const nextPrimary = remaining[0];

      if (nextPrimary) {
        await this._addressRepository.updateByIdForUser(
          nextPrimary._id.toString(),
          userId,
          { isPrimary: true },
        );
      }
    }

    logger.info(LOG_MESSAGES.USER.ADDRESS_DELETED, { userId, addressId });
  }

  async setPrimary(userId: string, addressId: string): Promise<AddressDTO> {
    const address = await this._addressRepository.findByIdForUser(addressId, userId);

    if (!address) {
      throw new BadRequestError(ERROR_MESSAGES.USER.ADDRESS_NOT_FOUND);
    }

    await this._addressRepository.unsetPrimaryForUser(userId);
    const updated = await this._addressRepository.updateByIdForUser(
      addressId,
      userId,
      { isPrimary: true },
    );

    if (!updated) {
      throw new BadRequestError(ERROR_MESSAGES.USER.ADDRESS_NOT_FOUND);
    }

    logger.info(LOG_MESSAGES.USER.ADDRESS_PRIMARY_SET, { userId, addressId });
    return AddressMapper.toDTO(updated);
  }
}

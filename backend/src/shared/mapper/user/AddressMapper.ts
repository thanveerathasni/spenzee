import { IAddress } from "../../../models/Address.model";
import { AddressDTO } from "../../dto/user/address.dto";

export class AddressMapper {
  static toDTO(address: IAddress): AddressDTO {
    return {
      id: address._id.toString(),
      fullName: address.fullName,
      phone: address.phone,
      alternatePhone: address.alternatePhone,
      houseName: address.houseName,
      street: address.street,
      city: address.city,
      district: address.district,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      landmark: address.landmark,
      addressType: address.addressType,
      isPrimary: address.isPrimary,
    };
  }
}

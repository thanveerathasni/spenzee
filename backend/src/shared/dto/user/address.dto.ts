import { AddressType } from "../../../models/Address.model";

export interface AddressDTO {
  id: string;
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

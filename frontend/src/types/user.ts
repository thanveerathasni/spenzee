import type {
  User as AuthUser,
} from "../store/auth/auth.types";

export interface Address {
  id?: string;
  fullName?: string;
  phone?: string;
  alternatePhone?: string;
  houseName?: string;
  street?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  pincode?: string;
  landmark?: string;
  addressType?: "home" | "work" | "other";
  isPrimary?: boolean;
}

export interface User extends AuthUser {
  id?: string;
  gender?: string;
  dob?: string;
  occupation?: string;
  bio?: string;
  verificationStatus?: "verified" | "unverified";
  address?: Address;
}

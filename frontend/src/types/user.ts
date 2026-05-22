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

export interface User {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  gender?: string;
  dob?: string;
  occupation?: string;
  bio?: string;
  verificationStatus?: "verified" | "unverified";
  address?: Address;
}

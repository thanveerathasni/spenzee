export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface User {
  name?: string;
  email?: string;
  phone?: string;
 profileImage?: string;
  address?: Address;
}
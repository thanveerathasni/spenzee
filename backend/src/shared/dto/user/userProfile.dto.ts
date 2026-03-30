export interface UserProfileDTO {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  profileImage?: string;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  role: string;
  isVerified: boolean;
}
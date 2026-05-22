export interface UserProfileDTO {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  gender?: string;
  dob?: string;
  occupation?: string;
  bio?: string;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  role: string;
  isVerified: boolean;
  verificationStatus: "verified" | "unverified";
}

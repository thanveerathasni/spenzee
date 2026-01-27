export interface AuthUser {
  _id: string;
  email: string;
  role: "user" | "admin" | "provider";
  isVerified: boolean;
  provider?: "local" | "google";
  createdAt?: string;
  name: string;
}

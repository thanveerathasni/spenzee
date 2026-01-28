// frontend/src/store/auth.types.ts

export type UserRole = "user" | "admin" | "provider";
export type AuthProvider = "local" | "google";

export interface User {
  _id: string;
  name?: string;          
  email: string;
  role: UserRole;
  isVerified: boolean;
  isActive?: boolean;     
  provider?: AuthProvider;
  createdAt?: string;
}


export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
}

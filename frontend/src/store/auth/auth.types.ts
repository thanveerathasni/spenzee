export type UserRole =
  | "user"
  | "admin"
  | "provider";

export type AuthProvider =
  | "local"
  | "google";

export interface User {
  _id?: string;

  id?: string;

  name?: string;

  email: string;

  role: UserRole;

  phone?: string;

  isVerified: boolean;

  isActive?: boolean;

  provider?: AuthProvider;

  createdAt?: string;

  profilePicture?: string;

  hasAcceptedTerms?: boolean;
}

export interface AuthState {
  accessToken: string | null;

  user: User | null;

  isAuthenticated: boolean;

  isAuthChecked: boolean;

  isLoading: boolean;
}

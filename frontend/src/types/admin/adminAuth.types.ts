export interface Admin {
  id: string;
  email: string;
}

export interface AdminAuthState {
  accessToken: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
}

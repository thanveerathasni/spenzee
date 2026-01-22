import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getAccessToken } from "../util/tokenStorage";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: string;
  role: "user" | "provider" | "admin";
}

interface Props {
  children: React.ReactNode;
  role?: "user" | "provider" | "admin";
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);

  const token = accessToken || getAccessToken();
  if (!token) return <Navigate to="/login" replace />;

  let finalRole = user?.role;

  if (!finalRole) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      finalRole = decoded.role;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  if (role && finalRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

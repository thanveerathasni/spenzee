import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { ReactElement } from "react";
import type { RootState } from "../store/store";

interface Props {
  allowedRoles: Array<"user" | "provider" | "admin">;
  children: ReactElement;
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

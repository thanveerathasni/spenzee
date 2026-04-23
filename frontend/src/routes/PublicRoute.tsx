import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { RootState } from "../store/store";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, user, isAuthChecked } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user) {
    if (user.role === "provider") {
      if (!user.hasAcceptedTerms) {
        return <Navigate to="/provider/welcome" replace />;
      }
      return <Navigate to="/provider/dashboard" replace />;
    }

    // normal user
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
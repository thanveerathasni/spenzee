import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { RootState } from "../store/store";
import type { Role } from "../constants/roles";
import { de } from "zod/v4/locales";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

// const ProtectedRoute = ({
//   children,
//   allowedRoles,
// }: ProtectedRouteProps) => {
//   const { isAuthenticated, user ,isAuthChecked} = useSelector(
//     (state: RootState) => state.auth
//   );
 
  
//   if (!isAuthChecked) {
//   return <div>Loading...</div>;
// }
//   // Not logged in
//   if (!isAuthenticated || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Role-based restriction
//   if (
//     allowedRoles &&
//     !allowedRoles.includes(user.role)
//   ) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading, isAuthChecked } = useSelector(
    (state: RootState) => state.auth
  );
if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
export default ProtectedRoute;
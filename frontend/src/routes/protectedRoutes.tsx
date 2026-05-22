// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { ReactNode } from "react";
// import type { RootState } from "../store/store";
// import type { Role } from "../constants/roles";

// interface ProtectedRouteProps {
//   children: ReactNode;
//   allowedRoles?: Role[];
// }

// const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
//   const { isAuthenticated, user, isAuthChecked } = useSelector(
//     (state: RootState) => state.auth
//   );
// if (!isAuthChecked) {
//     return <div>Loading...</div>;
//   }


//   if (!isAuthenticated || !user) {
//   if (allowedRoles?.includes("provider")) {
//     return <Navigate to="/provider/login" replace />;
//   }
//   return <Navigate to="/login" replace />;
// }


//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <>{children}</>;
// };
// export default ProtectedRoute;
















import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { RootState } from "../store/store";
import type { Role } from "../constants/roles";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isAuthChecked } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase() as Role;

  console.log("ROLE CHECK:", role, allowedRoles);

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
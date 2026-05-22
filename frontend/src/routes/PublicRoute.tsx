// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { ReactNode } from "react";
// import type { RootState } from "../store/store";

// interface PublicRouteProps {
//   children: ReactNode;
// }

// const PublicRoute = ({ children }: PublicRouteProps) => {
//   const { isAuthenticated, user, isAuthChecked } = useSelector(
//     (state: RootState) => state.auth
//   );

//   const location = useLocation();

//   if (!isAuthChecked) {
//     return <div>Loading...</div>;
//   }

//   if (isAuthenticated && user) {
//     const role = user.role?.toLowerCase();

//     //  PROVIDER FLOW
//     if (role === "provider") {
//       if (!user.hasAcceptedTerms) {
//         return <Navigate to="/provider/welcome" replace />;
//       }
//       return <Navigate to="/provider/dashboard" replace />;
//     }

//     //  ADMIN FLOW
//     if (role === "admin") {
//       return <Navigate to="/admin/dashboard" replace />;
//     }
//     // USER FLOW 
//           if (
//       location.pathname === "/login" ||
//       location.pathname === "/signup"
//     ) {
//       return <Navigate to="/welcome" replace />;
//     }

//     return <>{children}</>;
//   }

//   return <>{children}</>;
// };

// export default PublicRoute;

















import { Navigate, useLocation } from "react-router-dom";
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

  const location = useLocation();

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/provider/login" ||
    location.pathname === "/provider/request";

  if (isAuthenticated && user && isAuthPage) {
    const role = user.role?.toLowerCase();

    // PROVIDER
    if (role === "provider") {
      if (!user.hasAcceptedTerms) {
        return <Navigate to="/provider/welcome" replace />;
      }
      return <Navigate to="/provider/dashboard" replace />;
    }

    // ADMIN
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // USER
    if (role === "user") {
      return <Navigate to="/welcome" replace />;
    }
  }

  return <>{children}</>;
};

export default PublicRoute;
import {
  Navigate,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import type {
  ReactNode,
} from "react";

import type {
  RootState,
} from "../store/store";

import type {
  Role,
} from "../constants/roles";

import {
  ROUTES,
} from "../constants/routes";

import AuthLoader from "../components/common/AuthLoader";

interface ProtectedRouteProps {
  children: ReactNode;

  allowedRoles?: Role[];
}

const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const {
    isAuthenticated,
    user,
    isAuthChecked,
  } = useSelector(
    (
      state: RootState,
    ) => state.auth,
  );

  /* ====================================================== */
  /* LOADING */
  /* ====================================================== */

  if (
    !isAuthChecked
  ) {
    return (
      <AuthLoader />
    );
  }

  /* ====================================================== */
  /* NOT AUTHENTICATED */
  /* ====================================================== */

  if (
    !isAuthenticated ||
    !user
  ) {
    return (
      <Navigate
        to={
          ROUTES.AUTH.LOGIN
        }
        replace
      />
    );
  }

  /* ====================================================== */
  /* ROLE CHECK */
  /* ====================================================== */

  const role =
    user.role as Role;

  if (
    allowedRoles &&
    !allowedRoles.includes(
      role,
    )
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
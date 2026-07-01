import {
  Navigate,
  useLocation,
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

import {
  ROUTES,
} from "../constants/routes";

import AuthLoader from "../components/common/AuthLoader";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({
  children,
}: PublicRouteProps) => {
  const {
    isAuthenticated,
    user,
    isAuthChecked,
  } = useSelector(
    (
      state: RootState,
    ) => state.auth,
  );

  const location =
    useLocation();

  /* ====================================================== */
  /* LOADING */
  /* ====================================================== */

  if (
    !isAuthChecked
  ) {
    return <AuthLoader />;
  }

  /* ====================================================== */
  /* AUTH PAGES */
  /* ====================================================== */

  const isAuthPage =
    location.pathname ===
      ROUTES.AUTH
        .LOGIN ||
    location.pathname ===
      ROUTES.AUTH
        .SIGNUP ||
    location.pathname ===
      ROUTES.PROVIDER
        .LOGIN ||
    location.pathname ===
      ROUTES.PROVIDER
        .REQUEST;

  /* ====================================================== */
  /* REDIRECT AUTHENTICATED USERS */
  /* ====================================================== */

  if (
    isAuthenticated &&
    user &&
    isAuthPage
  ) {
    /* PROVIDER */

    if (
      user.role ===
      "provider"
    ) {
      if (
        !user.hasAcceptedTerms
      ) {
        return (
          <Navigate
            to={
              ROUTES
                .PROVIDER
                .WELCOME
            }
            replace
          />
        );
      }

      return (
        <Navigate
          to={
            ROUTES
              .PROVIDER
              .DASHBOARD
          }
          replace
        />
      );
    }

    /* ADMIN */

    if (
      user.role ===
      "admin"
    ) {
      return (
        <Navigate
          to={
            ROUTES
              .ADMIN
              .DASHBOARD
          }
          replace
        />
      );
    }

    /* USER */

    return (
      <Navigate
        to={
          ROUTES
            .USER
            .WELCOME
        }
        replace
      />
    );
  }

  return <>{children}</>;
};

export default PublicRoute;
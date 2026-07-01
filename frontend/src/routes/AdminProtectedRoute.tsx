import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import type {
  RootState,
} from "../store/store";

import {
  ROUTES,
} from "../constants/routes";

import AuthLoader from "../components/common/AuthLoader";

const AdminProtectedRoute =
  () => {
    const {
      isAuthenticated,
      admin,
      isAuthChecked,
    } = useSelector(
      (
        state: RootState,
      ) => state.adminAuth,
    );

    /* ====================================================== */
    /* LOADING */
    /* ====================================================== */

    if (
      !isAuthChecked
    ) {
      return <AuthLoader />;
    }

    /* ====================================================== */
    /* NOT AUTHORIZED */
    /* ====================================================== */

    if (
      !isAuthenticated ||
      !admin
    ) {
      return (
        <Navigate
          to={
            ROUTES
              .ADMIN
              .LOGIN
          }
          replace
        />
      );
    }

    return <Outlet />;
  };

export default AdminProtectedRoute;
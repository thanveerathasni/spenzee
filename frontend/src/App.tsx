import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
} from "react-redux";

import {
  loadAuth,
} from "./store/auth/authStorage";

/* ====================================================== */
/* ADMIN AUTH */
/* ====================================================== */

import {
  setAdminAuth,
  clearAdminAuth,
} from "./store/admin/adminAuth.slice";

import {
  adminAuthApi,
} from "./api/admin/adminAuth.api";

/* ====================================================== */
/* PAGES */
/* ====================================================== */

import Landing from "./pages/public/Landing";

import LoginForm from "./pages/user/Auth/UserLogin";

import SignupForm from "./pages/user/Auth/UserSignup";

import WelcomePage from "./pages/user/Auth/welcome";

import UserDashboard from "./pages/user/Dashboard";

import ForgotPassword from "./pages/user/Auth/forgotPassword";

import ResetPassword from "./pages/user/Auth/ResetPassword";

import ProviderLoginForm from "./pages/provider/auth/ProviderLogin";

import ProviderRequestForm from "./pages/provider/auth/ProviderRequest";

import ProviderSetupPasswordPage from "./pages/provider/auth/ProviderSetupPassword";

import ProviderWelcome from "./pages/provider/ProviderWelcome";

import ProviderDashboard from "./pages/provider/Dashboard";

import ProviderProfile from "./pages/provider/Profile";

import ProfilePage from "./pages/user/profile/ProfilePage";

import VerificationPage from "./pages/user/VerificationPage";
import FinancialInsightsPage from "./pages/user/FinancialInsightsPage";
import FinancialUploadPage from "./pages/user/financial/FinancialUploadPage";
import FinancialStatementsPage from "./pages/user/financial/FinancialStatementsPage";
import FinancialAnalyticsPage from "./pages/user/financial/FinancialAnalyticsPage";

import ProviderVerification from "./pages/provider/ProviderVerification";

import ProviderPending from "./pages/provider/auth/ProviderPending";

import ProviderForgotPassword from "./pages/provider/auth/ProviderForgotPassword";

import ProviderResetPassword from "./pages/provider/auth/ProviderResetPassword";

import AdminLogin from "./pages/admin/Auth/AdminLogin";

import DashboardPage from "./pages/admin/dashboard/DashboardPage";

import AdminProfile from "./pages/admin/profile/AdminProfile";

import AdminUsersPage from "./pages/admin/users/AdminUsersPage";

import AdminUserDetails from "./pages/admin/users/AdminUserDetails";

import AdminProvidersPage from "./pages/admin/providers/AdminProvidersPage";

import AdminProviderDetails from "./pages/admin/providers/AdminProviderDetails";

import AdminVerificationDashboard from "./pages/admin/verifications/AdminVerificationDashboard";

/* ====================================================== */
/* LAYOUTS */
/* ====================================================== */

import DashboardLayout from "./layouts/admin/DashboardLayout";

import ProviderLayout from "./layouts/ProviderLayout";
import UserFinancialLayout from "./layouts/UserFinancialLayout";

/* ====================================================== */
/* ROUTES */
/* ====================================================== */

import ProtectedRoute from "./routes/protectedRoutes";

import PublicRoute from "./routes/PublicRoute";

import AdminProtectedRoute from "./routes/AdminProtectedRoute";

import { ROUTES } from "./constants/routes";

/* ====================================================== */
/* STORE */
/* ====================================================== */

import {
  authApi,
} from "./api/auth.api";

import {
  hydrateAuth,
  setAuth,
  clearAuth,
} from "./store/auth/auth.slice";

/* ====================================================== */
/* LOGGER */
/* ====================================================== */

import { logger } from "./util/logger/logger";

import { LOG_MESSAGES } from "./constants/logMessages";

/* ====================================================== */
/* FALLBACK */
/* ====================================================== */

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <h1 className="text-sm uppercase tracking-[0.4em] text-white/40">
      404 — Page Not Found
    </h1>
  </div>
);

/* ====================================================== */
/* APP CONTENT */
/* ====================================================== */

const AppContent = () => {
  const dispatch =
    useDispatch();

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    logger.info(
      LOG_MESSAGES.APP.INITIALIZED,
    );

    const initializeAuth =
      async () => {
        /* ============================================== */
        /* USER AUTH */
        /* ============================================== */

        try {
          const auth =
            loadAuth();

          dispatch(
            hydrateAuth({
              accessToken:
                null,

              user:
                auth?.user ??
                null,
            }),
          );

          const refreshed =
            await authApi.refresh();

          if (
            refreshed &&
            refreshed.accessToken &&
            refreshed.user
          ) {
            dispatch(
              setAuth({
                accessToken:
                  refreshed.accessToken,

                user:
                  refreshed.user,
              }),
            );

            logger.info(
              "User session restored",
            );
          } else {
            dispatch(
              clearAuth(),
            );
          }
        } catch (
          error: unknown
        ) {
          logger.info(
            "No active user session",
          );

          dispatch(
            clearAuth(),
          );
        }

        /* ============================================== */
        /* ADMIN AUTH */
        /* ============================================== */

        try {
          const wasLoggedOut =
            sessionStorage.getItem(
              "admin_logged_out",
            );

          if (
            wasLoggedOut ===
            "true"
          ) {
            dispatch(
              clearAdminAuth(),
            );

            sessionStorage.removeItem(
              "admin_logged_out",
            );

            logger.info(
              "Admin intentionally logged out",
            );
          } else {
            const refreshedAdmin =
              await adminAuthApi.refresh();

            if (
              refreshedAdmin &&
              refreshedAdmin.accessToken &&
              refreshedAdmin.admin
            ) {
              dispatch(
                setAdminAuth({
                  accessToken:
                    refreshedAdmin.accessToken,

                  admin:
                    refreshedAdmin.admin,
                }),
              );

              logger.info(
                "Admin session restored",
              );
            } else {
              dispatch(
                clearAdminAuth(),
              );
            }
          }
        } catch (
          error: unknown
        ) {
          logger.info(
            "No active admin session",
          );

          dispatch(
            clearAdminAuth(),
          );
        }

        /* ============================================== */
        /* HYDRATION DONE */
        /* ============================================== */

        setHydrated(
          true,
        );
      };

    void initializeAuth();
  }, [dispatch]);

  /* ====================================================== */
  /* WAIT FOR HYDRATION */
  /* ====================================================== */

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      <Route
        path={
          ROUTES.PUBLIC
            .LANDING
        }
        element={
          <Landing />
        }
      />

      <Route
        path={
          ROUTES.AUTH
            .LOGIN
        }
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />

      <Route
        path={
          ROUTES.AUTH
            .SIGNUP
        }
        element={
          <PublicRoute>
            <SignupForm />
          </PublicRoute>
        }
      />

      <Route
        path={
          ROUTES.PASSWORD
            .FORGOT
        }
        element={
          <ForgotPassword />
        }
      />

      <Route
        path={
          ROUTES.PASSWORD
            .RESET
        }
        element={
          <ResetPassword />
        }
      />

      <Route
        path={
          ROUTES.PROVIDER
            .LOGIN
        }
        element={
          <PublicRoute>
            <ProviderLoginForm />
          </PublicRoute>
        }
      />

      <Route
        path={
          ROUTES.PROVIDER
            .REQUEST
        }
        element={
          <PublicRoute>
            <ProviderRequestForm />
          </PublicRoute>
        }
      />

      <Route
        path={
          ROUTES.PROVIDER
            .SETUP_PASSWORD
        }
        element={
          <ProviderSetupPasswordPage />
        }
      />

      <Route
        path={
          ROUTES.PROVIDER
            .FORGOT_PASSWORD
        }
        element={
          <ProviderForgotPassword />
        }
      />

      <Route
        path={
          ROUTES.PROVIDER
            .RESET_PASSWORD
        }
        element={
          <ProviderResetPassword />
        }
      />

      <Route
        path={
          ROUTES.PROVIDER
            .PENDING
        }
        element={
          <ProviderPending />
        }
      />

      <Route
        path={
          ROUTES.USER
            .WELCOME
        }
        element={
          <ProtectedRoute
            allowedRoles={[
              "user",
            ]}
          >
            <WelcomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path={
          ROUTES.USER
            .DASHBOARD
        }
        element={
          <ProtectedRoute
            allowedRoles={[
              "user",
            ]}
          >
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={
          ROUTES.USER
            .PROFILE
        }
        element={
          <ProtectedRoute
            allowedRoles={[
              "user",
            ]}
          >
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path={
          ROUTES.USER
            .VERIFICATION
        }
        element={
          <ProtectedRoute
            allowedRoles={[
              "user",
            ]}
          >
            <VerificationPage />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "user",
            ]}
          >
            <UserFinancialLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path={
            ROUTES.USER
              .FINANCIAL_INSIGHTS_DASHBOARD
          }
          element={
            <Navigate
              to={
                ROUTES.USER
                  .FINANCIAL_INSIGHTS
              }
              replace
            />
          }
        />
        <Route
          path={
            ROUTES.USER
              .FINANCIAL_INSIGHTS
          }
          element={
            <FinancialInsightsPage />
          }
        />
        <Route
          path={
            ROUTES.USER
              .FINANCIAL_INSIGHTS_UPLOAD
          }
          element={
            <FinancialUploadPage />
          }
        />
        <Route
          path={
            ROUTES.USER
              .FINANCIAL_INSIGHTS_STATEMENTS
          }
          element={
            <FinancialStatementsPage />
          }
        />
        <Route
          path={
            ROUTES.USER
              .FINANCIAL_INSIGHTS_ANALYTICS
          }
          element={
            <FinancialAnalyticsPage />
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "provider",
            ]}
          >
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route
          element={
            <ProviderLayout>
              <Outlet />
            </ProviderLayout>
          }
        >
          <Route
            path={
              ROUTES.PROVIDER
                .WELCOME
            }
            element={
              <ProviderWelcome />
            }
          />

          <Route
            path={
              ROUTES.PROVIDER
                .DASHBOARD
            }
            element={
              <ProviderDashboard />
            }
          />

          <Route
            path={
              ROUTES.PROVIDER
                .PROFILE
            }
            element={
              <ProviderProfile />
            }
          />

          <Route
            path={
              ROUTES.PROVIDER
                .VERIFICATION
            }
            element={
              <ProviderVerification />
            }
          />
        </Route>
      </Route>

      <Route
        path={
          ROUTES.ADMIN
            .LOGIN
        }
        element={
          <AdminLogin />
        }
      />

      <Route
        element={
          <AdminProtectedRoute />
        }
      >
        <Route
          element={
            <DashboardLayout />
          }
        >
          <Route
            path={
              ROUTES.ADMIN
                .DASHBOARD
            }
            element={
              <DashboardPage />
            }
          />

          <Route
            path={
              ROUTES.ADMIN
                .PROFILE
            }
            element={
              <AdminProfile />
            }
          />

          <Route
            path={
              ROUTES.ADMIN
                .USERS
            }
            element={
              <AdminUsersPage />
            }
          />

          <Route
            path={
              ROUTES.ADMIN
                .USER_DETAILS(
                  ":id",
                )
            }
            element={
              <AdminUserDetails />
            }
          />

          <Route
            path={
              ROUTES.ADMIN
                .PROVIDERS
            }
            element={
              <AdminProvidersPage />
            }
          />

          <Route
            path={
              ROUTES.ADMIN
                .PROVIDER_DETAILS(
                  ":id",
                )
            }
            element={
              <AdminProviderDetails />
            }
          />

          <Route
            path={
              ROUTES.ADMIN
                .USER_VERIFICATIONS
            }
            element={
              <AdminVerificationDashboard
                mode="users"
              />
            }
          />

          <Route
            path={
              ROUTES.ADMIN
                .PROVIDER_VERIFICATIONS
            }
            element={
              <AdminVerificationDashboard
                mode="providers"
              />
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <NotFound />
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

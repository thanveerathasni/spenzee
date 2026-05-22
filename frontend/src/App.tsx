
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

/* ---------- PAGES ---------- */
import Landing from "./pages/public/Landing";
import LoginForm from "./pages/user/Auth/UserLogin";
import SignupForm from "./pages/user/Auth/UserSignup";
import WelcomePage from "./pages/user/Auth/welcome";
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
import ProviderVerification from "./pages/provider/ProviderVerification";
import ProviderPending from "./pages/provider/auth/ProviderPending";
import AdminLogin from "./pages/admin/Auth/AdminLogin";
import ProviderForgotPassword from "./pages/provider/auth/ProviderForgotPassword";

import ProviderResetPassword from "./pages/provider/auth/ProviderResetPassword";
import DashboardPage from "./pages/admin/dashboard/DashboardPage";
import DashboardLayout from "./layouts/admin/DashboardLayout";
import AdminProfile from "./pages/admin/profile/AdminProfile";
import AdminUsersPage from "./pages/admin/users/AdminUsersPage";
import AdminProvidersPage from "./pages/admin/providers/AdminProvidersPage";
import AdminUserDetails from "./pages/admin/users/AdminUserDetails";
import AdminProviderDetails from "./pages/admin/providers/AdminProviderDetails";
import AdminVerificationDashboard from "./pages/admin/verifications/AdminVerificationDashboard";
import ProviderLayout from "./layouts/ProviderLayout";
/* ---------- ROUTES ---------- */
import ProtectedRoute from "./routes/protectedRoutes";
import PublicRoute from "./routes/PublicRoute"; 
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import { ROUTES } from "./constants/routes";

/* ---------- STORE ---------- */
import { hydrateAuth } from "./store/auth/auth.slice";

/* ---------- LOGGER ---------- */
import { logger } from "./util/logger/logger";
import { LOG_MESSAGES } from "./constants/logMessages";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <h1>404 – Page Not Found</h1>
  </div>
);

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    logger.info("Hydrating auth state");
    dispatch(hydrateAuth());
  }, [dispatch]);

   useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "accessToken") {
        if (!event.newValue) {
          localStorage.removeItem("accessToken");
          dispatch({ type: "auth/clearAuth" });
        } else {
          localStorage.setItem("accessToken", event.newValue);  
          dispatch(hydrateAuth());
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch])

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path={ROUTES.PUBLIC.LANDING} element={<Landing />} />

      <Route
        path={ROUTES.AUTH.LOGIN}
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />

      <Route
        path={ROUTES.AUTH.SIGNUP}
        element={
          <PublicRoute>
            <SignupForm />
          </PublicRoute>
        }
      />

      {/* PROVIDER PUBLIC */}
   <Route
  path={ROUTES.PROVIDER.LOGIN}
  element={
    <PublicRoute>
      <ProviderLoginForm />
    </PublicRoute>
  }
/>

   <Route
  path={ROUTES.PROVIDER.REQUEST}
  element={
    <PublicRoute>
      <ProviderRequestForm />
    </PublicRoute>
  }
/>

      <Route
  path={ROUTES.PROVIDER.SETUP_PASSWORD}
  element={<ProviderSetupPasswordPage />}
/>

<Route
  path={ROUTES.PROVIDER.FORGOT_PASSWORD}
  element={
    <PublicRoute>
      <ProviderForgotPassword />
    </PublicRoute>
  }
/>

<Route
  path={ROUTES.PROVIDER.RESET_PASSWORD}
  element={
    <PublicRoute>
      <ProviderResetPassword />
    </PublicRoute>
  }
/>
      

      {/* USER PROTECTED */}
      <Route
        path={ROUTES.USER.WELCOME}
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <WelcomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.USER.PROFILE}
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.USER.VERIFICATION}
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <VerificationPage />
          </ProtectedRoute>
        }
      />

   

      {/* PASSWORD */}
      <Route path={ROUTES.PASSWORD.FORGOT} element={<ForgotPassword />} />
      <Route path={ROUTES.PASSWORD.RESET} element={<ResetPassword />} />

      {/* PROVIDER PROTECTED */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["provider"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route element={<ProviderLayout><Outlet /></ProviderLayout>}>
          <Route path="/provider/welcome" element={<ProviderWelcome />} />
          <Route path="/provider/pending" element={<ProviderPending />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />
          <Route path={ROUTES.PROVIDER.VERIFICATION} element={<ProviderVerification />} />
        </Route>
      </Route>

      {/* ADMIN */}
      <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ADMIN.PROFILE} element={<AdminProfile />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/:id" element={<AdminUserDetails />} />
          <Route path="/admin/providers" element={<AdminProvidersPage />} />
          <Route path={ROUTES.ADMIN.PROVIDER_DETAILS(":id")} element={<AdminProviderDetails />} />
          <Route path={ROUTES.ADMIN.USER_VERIFICATIONS} element={<AdminVerificationDashboard mode="users" />} />
          <Route path={ROUTES.ADMIN.PROVIDER_VERIFICATIONS} element={<AdminVerificationDashboard mode="providers" />} />
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  logger.info(LOG_MESSAGES.APP.INITIALIZED);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}


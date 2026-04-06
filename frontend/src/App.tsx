import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ProfilePage from "./pages/user/profile/ProfilePage";

import AdminLogin from "./pages/admin/Auth/AdminLogin";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import DashboardLayout from "./layouts/admin/DashboardLayout";
import AdminProfile from "./pages/admin/profile/AdminProfile";

/* ---------- ROUTES ---------- */
import ProtectedRoute from "./routes/protectedRoutes";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import { ROUTES } from "./constants/routes";

/* ---------- STORE ---------- */
import { hydrateAuth } from "./store/auth/auth.slice";

/* ---------- LOGGER ---------- */
import { logger } from "./util/logger/logger";
import { LOG_MESSAGES } from "./constants/logMessages";

/* ---------- FALLBACK ---------- */
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

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path={ROUTES.PUBLIC.LANDING} element={<Landing />} />
      <Route path={ROUTES.AUTH.LOGIN} element={<LoginForm />} />
      <Route path={ROUTES.AUTH.SIGNUP} element={<SignupForm />} />

      {/* USER PROTECTED */}
      <Route
        path={ROUTES.USER.WELCOME}
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.USER.PROFILE}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* PASSWORD */}
      <Route path={ROUTES.PASSWORD.FORGOT} element={<ForgotPassword />} />
      <Route path={ROUTES.PASSWORD.RESET} element={<ResetPassword />} />

      {/* PROVIDER */}
      <Route path={ROUTES.PROVIDER.LOGIN} element={<ProviderLoginForm />} />
      <Route path={ROUTES.PROVIDER.REQUEST} element={<ProviderRequestForm />} />

      {/* ADMIN LOGIN */}
      <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />

      {/* ADMIN PROTECTED */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.ADMIN.PROFILE} element={<AdminProfile />} />
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


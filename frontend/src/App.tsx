


// import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

// /* ---------- PAGES ---------- */
// import Landing from "./pages/public/Landing";
// import LoginForm from "./pages/user/Auth/UserLogin";
// import SignupForm from "./pages/user/Auth/UserSignup";
// import WelcomePage from "./pages/user/Auth/welcome";
// import ForgotPassword from "./pages/user/Auth/forgotPassword";
// import ResetPassword from "./pages/user/Auth/ResetPassword";
// import ProviderLoginForm from "./pages/provider/auth/ProviderLogin";
// import ProviderRequestForm from "./pages/provider/auth/ProviderRequest";
// import ProviderSetupPasswordPage from "./pages/provider/auth/ProviderSetupPassword";
// import ProviderWelcome from "./pages/provider/ProviderWelcome";
// import ProviderDashboard from "./pages/provider/Dashboard";
// import ProviderProfile from "./pages/provider/Profile";
// import ProfilePage from "./pages/user/profile/ProfilePage";
// import ProviderPending from "./pages/provider/auth/ProviderPending";
// import {ProviderRoutes} from "./routes/provider/ProviderRoutes";
// import AdminLogin from "./pages/admin/Auth/AdminLogin";
// import Dashboard from "./pages/admin/dashboard/Dashboard";
// import DashboardLayout from "./layouts/admin/DashboardLayout";
// import AdminProfile from "./pages/admin/profile/AdminProfile";
// import AdminUsersPage from "./pages/admin/users/AdminUsersPage";
// import AdminProvidersPage from "./pages/admin/providers/AdminProvidersPage";
// import AdminUserDetails from "./pages/admin/users/AdminUserDetails";
// import ProviderLayout from "./layouts/ProviderLayout";
// /* ---------- ROUTES ---------- */
// import ProtectedRoute from "./routes/protectedRoutes";
// import AdminProtectedRoute from "./routes/AdminProtectedRoute";
// import { ROUTES } from "./constants/routes";

// /* ---------- STORE ---------- */
// import { hydrateAuth } from "./store/auth/auth.slice";

// /* ---------- LOGGER ---------- */
// import { logger } from "./util/logger/logger";
// import { LOG_MESSAGES } from "./constants/logMessages";

// /* ---------- FALLBACK ---------- */
// const NotFound = () => (
//   <div className="min-h-screen flex items-center justify-center">
//     <h1>404 – Page Not Found</h1>
//   </div>
// );

// const AppContent = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     logger.info("Hydrating auth state");
//     dispatch(hydrateAuth());
//   }, [dispatch]);

//   return (
//     <Routes>
//       {/* PUBLIC */}
//       <Route path={ROUTES.PUBLIC.LANDING} element={<Landing />} />
//       <Route path={ROUTES.AUTH.LOGIN} element={<LoginForm />} />
//       <Route path={ROUTES.AUTH.SIGNUP} element={<SignupForm />} />

//       {/* USER PROTECTED */}
//       <Route
//         path={ROUTES.USER.WELCOME}
//         element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <WelcomePage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path={ROUTES.USER.PROFILE}
//         element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <ProfilePage />
//           </ProtectedRoute>
//         }
//       />

//       {/* PASSWORD */}
//       <Route path={ROUTES.PASSWORD.FORGOT} element={<ForgotPassword />} />
//       <Route path={ROUTES.PASSWORD.RESET} element={<ResetPassword />} />

//       {/* PROVIDER */}
//       <Route path={ROUTES.PROVIDER.LOGIN} element={<ProviderLoginForm />} />
//       <Route path={ROUTES.PROVIDER.REQUEST} element={<ProviderRequestForm />} />
//       <Route path="/provider/setup-password" element={<ProviderSetupPasswordPage />} />
//       <Route path="/provider/welcome" element={<ProtectedRoute allowedRoles={["provider"]}><ProviderWelcome /></ProtectedRoute>} />
//       <Route path="/provider/pending" element={<ProtectedRoute allowedRoles={["provider"]}><ProviderPending /></ProtectedRoute>} />

//       {/* PROVIDER PROTECTED */}
//       <Route element={<ProtectedRoute allowedRoles={["provider"]}><Outlet />
//       </ProtectedRoute>}>
//         <Route element={<ProviderLayout><Outlet /></ProviderLayout>}>
//         <Route 
//   path="/provider/welcome" 
//   element={
//     <ProtectedRoute allowedRoles={["provider"]}>
//       <ProviderWelcome />
//     </ProtectedRoute>
//   } 
// />
//           <Route path="/provider/dashboard" element={<ProviderDashboard />} />
//           <Route path="/provider/profile" element={<ProviderProfile />} />

//         </Route>

//       </Route>

//       {/* ADMIN LOGIN */}
//       <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />

//       {/* ADMIN PROTECTED */}
//      <Route element={<AdminProtectedRoute />}>
//   <Route element={<DashboardLayout />}>
//     <Route path={ROUTES.ADMIN.DASHBOARD} element={<Dashboard />} />
//     <Route path={ROUTES.ADMIN.PROFILE} element={<AdminProfile />} />

//     {/* USERS */}
//     <Route path="/admin/users" element={<AdminUsersPage />} />
//     <Route path="/admin/users/:id" element={<AdminUserDetails />} />

//     {/* PROVIDERS */}
//     <Route path="/admin/providers" element={<AdminProvidersPage />} />
//   </Route>
// </Route>

//       {/* FALLBACK */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default function App() {
//   logger.info(LOG_MESSAGES.APP.INITIALIZED);

//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }





















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
import ProviderPending from "./pages/provider/auth/ProviderPending";
import AdminLogin from "./pages/admin/Auth/AdminLogin";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import DashboardLayout from "./layouts/admin/DashboardLayout";
import AdminProfile from "./pages/admin/profile/AdminProfile";
import AdminUsersPage from "./pages/admin/users/AdminUsersPage";
import AdminProvidersPage from "./pages/admin/providers/AdminProvidersPage";
import AdminUserDetails from "./pages/admin/users/AdminUserDetails";
import ProviderLayout from "./layouts/ProviderLayout";

/* ---------- ROUTES ---------- */
import ProtectedRoute from "./routes/protectedRoutes";
import PublicRoute from "./routes/PublicRoute"; // ✅ NEW
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
        path="/provider/login"
        element={
          <PublicRoute>
            <ProviderLoginForm />
          </PublicRoute>
        }
      />

      <Route
        path="/provider/request"
        element={
          <PublicRoute>
            <ProviderRequestForm />
          </PublicRoute>
        }
      />

      <Route
        path="/provider/setup-password"
        element={
          <PublicRoute>
            <ProviderSetupPasswordPage />
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
        </Route>
      </Route>

      {/* ADMIN */}
      <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.ADMIN.PROFILE} element={<AdminProfile />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/:id" element={<AdminUserDetails />} />
          <Route path="/admin/providers" element={<AdminProvidersPage />} />
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




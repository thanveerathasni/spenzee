

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

// import Landing from "./pages/public/Landing";
// import LoginForm from "./pages/user/Auth/UserLogin";
// import SignupForm from "./pages/user/Auth/UserSignup";
// import WelcomePage from "./pages/user/Auth/welcome";
// import ForgotPassword from "./pages/user/Auth/forgotPassword";
// import ResetPassword from "./pages/user/Auth/ResetPassword";
// import ProviderLoginForm from "./pages/provider/auth/ProviderLogin";
// import ProviderRequestForm from "./pages/provider/auth/ProviderRequest";
// import TestAuth from "./pages/public/TestAuth";
// import ProfilePage from "./pages/user/profile/ProfilePage";

// import AdminLogin from "./pages/admin/Auth/AdminLogin";
// import Dashboard from "./pages/admin/dashboard/Dashboard";
// import DashboardLayout from "./layouts/admin/DashboardLayout";
// import AdminProfile from "./pages/admin/profile/AdminProfile";
// import ProtectedRoute from "./routes/protectedRoutes";
// import AdminProtectedRoute from "./routes/AdminProtectedRoute";

// import { hydrateAuth } from "./store/auth/auth.slice";

// const NotFound = () => (
//   <div className="min-h-screen flex items-center justify-center">
//     <h1>404 – Page Not Found</h1>
//   </div>
// );

// const AppContent = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(hydrateAuth());
//   }, [dispatch]);

//   return (
//     <Routes>
//       {/* PUBLIC */}
//       <Route path="/" element={<Landing />} />
//       <Route path="/login" element={<LoginForm />} />
//       <Route path="/signup" element={<SignupForm />} />

//       {/* USER */}
//       <Route
//         path="/welcome"
//         element={
//           <ProtectedRoute>
//             <WelcomePage />
//           </ProtectedRoute>
//         }
//       />

//   <Route path="/profile" element={<ProfilePage />} />

//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       <Route path="/reset-password" element={<ResetPassword />} />

//       {/* PROVIDER */}
//       <Route path="/provider/login" element={<ProviderLoginForm />} />
//       <Route path="/provider/request" element={<ProviderRequestForm />} />

//       {/* ADMIN LOGIN */}
//       <Route path="/admin/login" element={<AdminLogin />} />

//       {/* ADMIN PROTECTED + LAYOUT */}
//       <Route element={<AdminProtectedRoute />}>
//         <Route element={<DashboardLayout />}>
//           <Route path="/admin/dashboard" element={<Dashboard />} />
//          <Route path="/admin/profile" element={<AdminProfile />} />
//         </Route>
//       </Route>

//       {/* MISC */}
//       <Route path="/test-auth" element={<TestAuth />} />
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// };















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
import TestAuth from "./pages/public/TestAuth";
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
      <Route path="/" element={<Landing />} />
      <Route path={ROUTES.AUTH.LOGIN} element={<LoginForm />} />
      <Route path={ROUTES.AUTH.SIGNUP} element={<SignupForm />} />

      {/* USER PROTECTED */}
      <Route
        path="/welcome"
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* PROVIDER */}
      <Route path="/provider/login" element={<ProviderLoginForm />} />
      <Route path="/provider/request" element={<ProviderRequestForm />} />

      {/* ADMIN LOGIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ADMIN PROTECTED */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>
      </Route>

      {/* TEST */}
      <Route path="/test-auth" element={<TestAuth />} />

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


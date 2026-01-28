// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginForm from './pages/user/Auth/UserLogin';
// import SignupForm from './pages/user/Auth/UserSignup';
// import Landing from './pages/public/Landing';
// import UserHome from './pages/user/Auth/UserHome';
// import ProviderLoginForm from './pages/provider/auth/ProviderLogin';
// import ProviderRequestForm from './pages/provider/auth/ProviderRequest';
// import TestAuth from './pages/public/TestAuth';
// import ProtectedRoute from "../src/routes/protectedRoutes";
// import WelcomePage from './pages/user/Auth/welcome';
// import ForgotPassword from './pages/user/Auth/forgotPassword';
// import ResetPassword from './pages/user/Auth/ResetPassword';
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { authApi } from "./api/auth.api";
// import { setAuth, clearAuth } from "./store/auth";

// // 404 Page
// const NotFound = () => (
//   <div className="min-h-screen bg-deep-space flex flex-center flex-col px-4 text-center">
//     <div className="blob-neon w-96 h-96 bg-neon-pink opacity-20 -top-20"></div>
//     <h1 className="text-9xl font-black text-stroke text-neon-pink mb-4 animate-wiggle">404</h1>
//     <h2 className="text-4xl font-black text-white mb-8">CONNECTION SEVERED</h2>
//     <p className="text-white/40 font-mono mb-12 uppercase tracking-widest text-sm">
//       // The requested resource has been lost in the void
//     </p>
//     <a href="/" className="btn-neon px-12">RE-ESTABLISH LINK →</a>
//   </div>
// );

// const AppContent = () => {
//   console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
//  const dispatch = useDispatch();

//   useEffect(() => {
//     authApi
//       .refresh()
//       .then((res) => {
//         dispatch(setAuth(res));
//       })
//       .catch(() => {
//         dispatch(clearAuth());
//       });
//   }, [dispatch]);
//   return (
//     <div className="relative selection:bg-neon-pink/30 selection:text-white">
//       <main className="relative z-10 transition-all duration-500">
//         <Routes>
//           {/* Public */}
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/signup" element={<SignupForm />} />
//           <Route
//             path="/welcome"
//             element={
//               <ProtectedRoute>
//                 <WelcomePage />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />


//           {/* Provider public */}
//           <Route path="/provider/login" element={<ProviderLoginForm />} />
//           <Route path="/provider/request" element={<ProviderRequestForm />} />

//           {/* User protected */}
//           <Route
//   path="/dashboard"
//   element={
//     <ProtectedRoute allowedRoles={["user"]}>
//       <UserHome />
//     </ProtectedRoute>
//   }
// />


//           {/* <Route
//   path="/admin"
//   element={
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <AdminLayout />
//     </ProtectedRoute>
//   }
// /> */}

//           {/* Unauthorized */}
//           <Route path="/unauthorized" element={<div>No Access 🚫</div>} />

//           <Route path="/test-auth" element={<TestAuth />} />

//           {/* 404 — ALWAYS LAST */}
//           <Route path="*" element={<NotFound />} />



//         </Routes>
//       </main>
//     </div>
//   );
// };

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;









import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginForm from "./pages/user/Auth/UserLogin";
import SignupForm from "./pages/user/Auth/UserSignup";
import Landing from "./pages/public/Landing";
import UserHome from "./pages/user/Auth/UserHome";
import ProviderLoginForm from "./pages/provider/auth/ProviderLogin";
import ProviderRequestForm from "./pages/provider/auth/ProviderRequest";
import TestAuth from "./pages/public/TestAuth";
import ProtectedRoute from "./routes/protectedRoutes";
import WelcomePage from "./pages/user/Auth/welcome";
import ForgotPassword from "./pages/user/Auth/forgotPassword";
import ResetPassword from "./pages/user/Auth/ResetPassword";
import { markAuthChecked } from "./store/auth/auth.slice";
import { authApi } from "./api/auth.api";
import { setAuth, clearAuth ,hydrateAuth} from "./store/auth/auth.slice";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
// 404 Page
const NotFound = () => (
  <div className="min-h-screen bg-deep-space flex flex-center flex-col px-4 text-center">
    <div className="blob-neon w-96 h-96 bg-neon-pink opacity-20 -top-20"></div>
    <h1 className="text-9xl font-black text-stroke text-neon-pink mb-4 animate-wiggle">404</h1>
    <h2 className="text-4xl font-black text-white mb-8">CONNECTION SEVERED</h2>
    <p className="text-white/40 font-mono mb-12 uppercase tracking-widest text-sm">
      // The requested resource has been lost in the void
    </p>
    <a href="/" className="btn-neon px-12">RE-ESTABLISH LINK →</a>
  </div>
);
const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const auth = useSelector((state: RootState) => state.auth);
// useEffect(() => {
//   if (auth.accessToken) {
//     dispatch(markAuthChecked());
//     return;
//   }

//   authApi
//     .refresh()
//     .then((res) => {
//       dispatch(
//         setAuth({
//           accessToken: res.accessToken,
//           user: res.user,
//         })
//       );
//     })
//     .catch(() => {
//       // ❌ don't logout on boot
//       dispatch(markAuthChecked());
//     });
// }, []);

useEffect(() => {
  const initAuth = async () => {
    try {
      const res = await authApi.refresh();
      dispatch(setAuth({
        accessToken: res.accessToken,
        user: res.user,
      }));
    } catch {
      dispatch(clearAuth());
    }
  };

  initAuth();
}, [dispatch]);



useEffect(() => {
  dispatch(hydrateAuth());
}, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />

      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/provider/login" element={<ProviderLoginForm />} />
      <Route path="/provider/request" element={<ProviderRequestForm />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserHome />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<div>No Access 🚫</div>} />
      <Route path="/test-auth" element={<TestAuth />} />
      <Route path="*" element={<NotFound />} />
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

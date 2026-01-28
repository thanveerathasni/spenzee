

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Navbar } from "../../public/Landing";
// import { loginApi } from "../../../api/authApi";
// import { useAppDispatch } from "../../../store/hooks";
// import { setAuth } from "../../../store/auth";
// import toast from "react-hot-toast";

// interface Errors {
//   email?: string;
//   password?: string;
// }

// const LoginForm: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState<Errors>({});

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const validate = () => {
//     const newErrors: Errors = {};
//     if (!formData.email.trim()) newErrors.email = "Email required";
//     if (!formData.password.trim()) newErrors.password = "Password required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const res = await loginApi({
//         email: formData.email,
//         password: formData.password,
//       });

//       // 🔑 SINGLE SOURCE OF TRUTH
//       dispatch(
//         setAuth({
//           accessToken: res.accessToken,
//           user: res.user, // backend must send user object
//         })
//       );

//       toast.success("Login successful");

//       if (res.user.role === "admin") {
//         navigate("/admin/welcome", { replace: true });
//       } else if (res.user.role === "provider") {
//         navigate("/provider", { replace: true });
//       } else {
//         navigate("/welcome", { replace: true });
//       }
//     } catch (err) {
//       toast.error("Login failed");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="mt-20 max-w-md mx-auto px-6">
//         <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl">
//           <header className="mb-8 text-center">
//             <h1 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter italic leading-none">
//               {view === 'login' ? 'Sign In' : view === 'forgot' ? 'Identify' : 'Renew'}
//             </h1>
//             <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mt-3">
//               {view === 'login' ? 'Access your account' : view === 'forgot' ? 'Account recovery' : 'Set new password'}
//             </p>
//             <div className="flex justify-center gap-4 mb-6">
//               <button
//                 type="button"
//                 className={`px-6 py-2 rounded-lg font-bold text-sm transition bg-black text-white dark:bg-white dark:text-black`}
//               >
//                 User
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate('/provider/login')}
//                 className={`px-6 py-2 rounded-lg font-bold text-sm transition bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400`}
//               >
//                 Provider
//               </button>
//             </div>
//           </header>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {view === 'login' && (
//               <GoogleLogin
//                 onSuccess={async (cred) => {
//                   try {
//                     const res = await api.post("/auth/google", {
//                       credential: cred.credential,
//                     });

//                     localStorage.setItem("accessToken", res.data.accessToken);
//                     toast.success('Google login successful');
//                     navigate("/welcome", { replace: true });
//                   } catch {
//                     toast.error("Google login failed");
//                   }
//                 }}
//                 onError={() => toast.error("Google login failed")}
//               />
//             )}

//             <div className="space-y-4">
//               <div>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Email"
//                   disabled={view === 'reset'}
//                   className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition disabled:opacity-50 placeholder-neutral-400 font-medium"
//                 />
//                 {errors.email && (
//                   <p className="mt-2 ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest">
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               {view === 'login' && (
//                 <div>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Password"
//                     className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition placeholder-neutral-400 font-medium"
//                   />
//                   {errors.password && (
//                     <p className="mt-2 ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest">
//                       {errors.password}
//                     </p>
//                   )}
//                   <div className="flex justify-end mt-2">
//                     <button
//                       type="button"
//                       onClick={() => navigate('/forgot-password')}
//                       className="text-[9px] font-black uppercase text-neutral-400 hover:text-black dark:hover:text-white transition tracking-widest"
//                     >
//                       Forgot Password?
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="w-full py-4.5 mt-4 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white rounded-xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-neutral-300 dark:hover:bg-neutral-700 active:scale-[0.99] transition shadow-sm"
//             >
//               Sign In
//             </button>
//           </form>

//           <footer className="mt-10 text-center pt-8 border-t border-neutral-50 dark:border-neutral-800">
//             <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest">
//               No account?
//               <button
//                 onClick={() => navigate('/signup')}
//                 className="ml-3 text-black dark:text-white hover:underline underline-offset-4 decoration-2"
//               >
//                 Create One
//               </button>
//             </p>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginForm;




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Navbar } from "../../public/Landing";
// import { authApi } from "../../../api/auth.api";
// import { useAppDispatch } from "../../../store/hooks";
// import { setAuth } from "../../../store/auth";
// import toast from "react-hot-toast";
// import { GoogleLogin } from "@react-oauth/google";
// import { api } from "../../../api/axios";

// interface Errors {
//   email?: string;
//   password?: string;
// }

// type LoginView = "login" | "forgot" | "reset";

// const LoginForm: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   // ✅ FIX 1: define `view` (NO UI CHANGE)
//   const [view] = useState<LoginView>("login");

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState<Errors>({});

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const validate = () => {
//     const newErrors: Errors = {};
//     if (!formData.email.trim()) newErrors.email = "Email required";
//     if (!formData.password.trim()) newErrors.password = "Password required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const res = await authApi({
//         email: formData.email,
//         password: formData.password,
//       });

//       // ✅ Redux = single source of truth
//       dispatch(
//         setAuth({
//           accessToken: res.accessToken,
//           user: res.user,
//         })
//       );

//       toast.success("Login successful");

//       if (res.user.role === "admin") {
//         navigate("/admin/welcome", { replace: true });
//       } else if (res.user.role === "provider") {
//         navigate("/provider", { replace: true });
//       } else {
//         navigate("/welcome", { replace: true });
//       }
//     } catch {
//       toast.error("Login failed");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div></div>
//       <div className="mt-20 max-w-md mx-auto px-6">
//         <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl">
//           <header className="mb-8 text-center">
//             <h1 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter italic leading-none">
//               {view === "login"
//                 ? "Sign In"
//                 : view === "forgot"
//                 ? "Identify"
//                 : "Renew"}
//             </h1>
//             <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mt-3">
//               {view === "login"
//                 ? "Access your account"
//                 : view === "forgot"
//                 ? "Account recovery"
//                 : "Set new password"}
//             </p>
//             <div className="flex justify-center gap-4 mb-6">
//               <button
//                 type="button"
//                 className="px-6 py-2 rounded-lg font-bold text-sm transition bg-black text-white dark:bg-white dark:text-black"
//               >
//                 User
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate("/provider/login")}
//                 className="px-6 py-2 rounded-lg font-bold text-sm transition bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
//               >
//                 Provider
//               </button>
//             </div>
//           </header>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {view === "login" && (
//               <GoogleLogin
//                 onSuccess={async (cred) => {
//                   try {
//                     const res = await api.post("/auth/google", {
//                       credential: cred.credential,
//                     });

//                     dispatch(
//                       setAuth({
//                         accessToken: res.data.accessToken,
//                         user: res.data.user,
//                       })
//                     );

//                     toast.success("Google login successful");
//                     navigate("/welcome", { replace: true });
//                   } catch {
//                     toast.error("Google login failed");
//                   }
//                 }}
//                 onError={() => toast.error("Google login failed")}
//               />
//             )}

//             <div className="space-y-4">
//               <div>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Email"
//                   disabled={view === "reset"}
//                   className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition disabled:opacity-50 placeholder-neutral-400 font-medium"
//                 />
//                 {errors.email && (
//                   <p className="mt-2 ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest">
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               {view === "login" && (
//                 <div>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Password"
//                     className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition placeholder-neutral-400 font-medium"
//                   />
//                   {errors.password && (
//                     <p className="mt-2 ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest">
//                       {errors.password}
//                     </p>
//                   )}
//                   <div className="flex justify-end mt-2">
//                     <button
//                       type="button"
//                       onClick={() => navigate("/forgot-password")}
//                       className="text-[9px] font-black uppercase text-neutral-400 hover:text-black dark:hover:text-white transition tracking-widest"
//                     >
//                       Forgot Password?
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="w-full py-4.5 mt-4 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white rounded-xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-neutral-300 dark:hover:bg-neutral-700 active:scale-[0.99] transition shadow-sm"
//             >
//               Sign In
//             </button>
//           </form>

//           <footer className="mt-10 text-center pt-8 border-t border-neutral-50 dark:border-neutral-800">
//             <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest">
//               No account?
//               <button
//                 onClick={() => navigate("/signup")}
//                 className="ml-3 text-black dark:text-white hover:underline underline-offset-4 decoration-2"
//               >
//                 Create One
//               </button>
//             </p>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginForm;






import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../public/Landing";
import { authApi } from "../../../api/auth.api";
import { useAppDispatch } from "../../../store/hooks";
import { setAuth } from "../../../store/auth";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useEffect } from "react";
interface Errors {
  email?: string;
  password?: string;
}

type LoginView = "login" | "forgot" | "reset";

let googleLoginInProgress = false;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // UI stays same
  const [view] = useState<LoginView>("login");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (!formData.password.trim()) newErrors.password = "Password required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= NORMAL LOGIN =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      dispatch(setAuth(res));
      toast.success("Login successful");

      if (res.user.role === "admin") {
        navigate("/admin/welcome", { replace: true });
      } else if (res.user.role === "provider") {
        navigate("/provider", { replace: true });
      } else {
        navigate("/welcome", { replace: true });
      }
    } catch {
      toast.error("Login failed");
    }
  };


  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

useEffect(() => {
  if (isAuthenticated) {
    navigate("/welcome", { replace: true });
  }
}, [isAuthenticated]);

  // ================= GOOGLE LOGIN =================
  const handleGoogleSuccess = async (cred: any) => {
    if (!cred?.credential || googleLoginInProgress) return;

    googleLoginInProgress = true;

    try {
      const res = await authApi.googleLogin(cred.credential);

      dispatch(setAuth(res));
      toast.success("Google login successful");
      navigate("/welcome", { replace: true });
    } catch {
      toast.error("Google login failed");
    } finally {
      googleLoginInProgress = false;
    }
  };

  return (
    <>
      <Navbar />

      <div className="mt-20 max-w-md mx-auto px-6">
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter italic leading-none">
              {view === "login"
                ? "Sign In"
                : view === "forgot"
                ? "Identify"
                : "Renew"}
            </h1>
            <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mt-3">
              {view === "login"
                ? "Access your account"
                : view === "forgot"
                ? "Account recovery"
                : "Set new password"}
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <button
                type="button"
                className="px-6 py-2 rounded-lg font-bold text-sm transition bg-black text-white dark:bg-white dark:text-black"
              >
                User
              </button>
              <button
                type="button"
                onClick={() => navigate("/provider/login")}
                className="px-6 py-2 rounded-lg font-bold text-sm transition bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              >
                Provider
              </button>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === "login" && (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
              />
            )}

            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  disabled={view === "reset"}
                  className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition disabled:opacity-50 placeholder-neutral-400 font-medium"
                />
                {errors.email && (
                  <p className="mt-2 ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest">
                    {errors.email}
                  </p>
                )}
              </div>

              {view === "login" && (
                <div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition placeholder-neutral-400 font-medium"
                  />
                  {errors.password && (
                    <p className="mt-2 ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest">
                      {errors.password}
                    </p>
                  )}
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-[9px] font-black uppercase text-neutral-400 hover:text-black dark:hover:text-white transition tracking-widest"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4.5 mt-4 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white rounded-xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-neutral-300 dark:hover:bg-neutral-700 active:scale-[0.99] transition shadow-sm"
            >
              Sign In
            </button>
          </form>

          <footer className="mt-10 text-center pt-8 border-t border-neutral-50 dark:border-neutral-800">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest">
              No account?
              <button
                onClick={() => navigate("/signup")}
                className="ml-3 text-black dark:text-white hover:underline underline-offset-4 decoration-2"
              >
                Create One
              </button>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

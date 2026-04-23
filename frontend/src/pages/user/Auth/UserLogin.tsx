


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../public/Landing";
import { authApi } from "../../../api/auth.api";
import { useAppDispatch } from "../../../store/hooks";
import { setAuth } from "../../../store/auth";
import toast from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { ALERT_MESSAGES } from "../../../constants/messages";

interface Errors {
  email?: string;
  password?: string;
}

type LoginView = "login" | "forgot" | "reset";

let googleLoginInProgress = false;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [view] = useState<LoginView>("login");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/welcome", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      dispatch(setAuth(res));
      toast.success(ALERT_MESSAGES.AUTH.LOGIN_SUCCESS);

      if (res.user.role === "admin") {
        navigate("/admin/welcome", { replace: true });
      } else if (res.user.role === "provider") {
        navigate("/provider", { replace: true });
      } else {
        navigate("/welcome", { replace: true });
      }
    } catch {
      toast.error(ALERT_MESSAGES.AUTH.LOGIN_FAILED);
    }
  };

  const handleGoogleSuccess = async (cred: CredentialResponse) => {
    if (!cred?.credential || googleLoginInProgress) return;

    googleLoginInProgress = true;

    try {
      const res = await authApi.googleLogin(cred.credential);
      dispatch(setAuth(res));
      toast.success(ALERT_MESSAGES.AUTH.GOOGLE_LOGIN_SUCCESS);
      navigate("/welcome", { replace: true });
    } catch {
      toast.error(ALERT_MESSAGES.AUTH.GOOGLE_LOGIN_FAILED);
    } finally {
      googleLoginInProgress = false;
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center pt-28 px-6">
        <h1 className="text-4xl md:text-5xl font-serif  mb-10 tracking-tighter">
          Spenzee
        </h1>

        <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <header className="mb-8 text-center">
            <h1 className="text-xl text-white font-light">
              Sign In
            </h1>
            <p className="text-xs text-gray-700 tracking-widest uppercase mt-2">
              Access your account
            </p>

            {/* User / Provider switch — KEPT */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-lg font-bold text-sm bg-white text-black"
              >
                User
              </button>
              <button
                type="button"
                onClick={() => navigate("/provider/login")}
                className="px-6 py-2 rounded-lg font-bold text-sm bg-white/10 text-black hover:text-white transition"
              >
                Provider
              </button>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5 ">
            {view === "login" && (
              <GoogleLogin 
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error(ALERT_MESSAGES.AUTH.GOOGLE_LOGIN_FAILED)}
              />
            )}

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password with icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? (
                  /* eye-off */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  /* eye */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>

              {errors.password && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.password}
                </p>
              )}

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-gray-700 hover:text-white transition"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-white text-black font-medium tracking-wide hover:bg-gray-200 transition"
            >
              SIGN IN
            </button>
          </form>

          <footer className="mt-10 text-center text-xs text-gray-500">
            No account?
            <button
              onClick={() => navigate("/signup")}
              className="ml-2 text-white hover:underline"
            >
              Create One
            </button>
          </footer>

        </div>
       
      <div className="mt-12 text-gray-700 text-[10px] tracking-[0.2em] uppercase">
        &copy; {new Date().getFullYear()} Spenzee Studios
      </div>
      </div>
    </>
  );
};

export default LoginForm;







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
import { mapApiError } from "../../../util/errorHandler";
import { motion, AnimatePresence } from "framer-motion";
import PasswordInput from "../../../components/common/PasswordInput";
import { persistAuth } from "../../../store/auth/authStorage";
import type {
  User,
  UserRole,
} from "../../../store/auth/auth.types";
interface Errors {
  email?: string;
  password?: string;
}

type LoginView = "login" | "forgot" | "reset";
let googleLoginInProgress = false;

// const EyeIcon = ({ open }: { open: boolean }) =>
//   open ? (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//       <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
//       <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="2" />
//     </svg>
//   ) : (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//       <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" stroke="currentColor" strokeWidth="2" />
//       <path d="M6.35 6.35C4.31 7.72 2.85 9.68 2 12c1.73 4.39 6 7.5 10 7.5 1.55 0 3.03-.37 4.35-1.02" stroke="currentColor" strokeWidth="2" />
//       <path d="M17.94 17.94A9.96 9.96 0 0022 12c-1.73-4.39-6-7.5-10-7.5-1.3 0-2.55.24-3.7.68" stroke="currentColor" strokeWidth="2" />
//     </svg>
//   );

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [view] = useState<LoginView>("login");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  // const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

const { isAuthenticated, user } = useSelector(
  (state: RootState) => state.auth
);
  // useEffect(() => {
  //   if (isAuthenticated) navigate("/welcome", { replace: true });
  // }, [isAuthenticated, navigate]);


  useEffect(() => {
  if (!isAuthenticated || !user) return;

  if (user.role === "admin") {
    navigate("/admin/dashboard", { replace: true });
  } else if (user.role === "provider") {
    if (!user.hasAcceptedTerms) {
      navigate("/provider/welcome", { replace: true });
    } else {
      navigate("/provider/dashboard", { replace: true });
    }
  } else {
    navigate("/welcome", { replace: true });
  }
}, [isAuthenticated, user, navigate]);




  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validate()) return;
  //   try {
  //     const res = await authApi.login({ email: formData.email, password: formData.password });
  //     const safeUser = { ...res.user, role: res.user.role || "user" };
  //     persistAuth(res.accessToken, safeUser);
  //     localStorage.removeItem("admin_token");
  //     localStorage.removeItem("provider_welcome_seen");
  //     dispatch(setAuth({ accessToken: res.accessToken, user: safeUser }));
  //     toast.success(ALERT_MESSAGES.AUTH.LOGIN_SUCCESS);
  //     if (safeUser.role === "admin") navigate("/admin/dashboard", { replace: true });
  //     else if (safeUser.role === "provider") navigate("/provider", { replace: true });
  //     else navigate("/welcome", { replace: true });
  //   } catch (err: unknown) {
  //     const mapped = mapApiError(err);
  //     if (mapped.field) setErrors((prev) => ({ ...prev, [mapped.field as keyof Errors]: mapped.message }));
  //     else toast.error(mapped.message || ALERT_MESSAGES.AUTH.LOGIN_FAILED);
  //   }
  // };

  // const handleGoogleSuccess = async (cred: CredentialResponse) => {
  //   if (!cred?.credential || googleLoginInProgress) return;
  //   googleLoginInProgress = true;
  //   try {
  //     const res = await authApi.googleLogin(cred.credential);
  //     localStorage.removeItem("admin_token");
  //     localStorage.removeItem("provider_welcome_seen");
  //     const safeUser = { ...res.user, role: (res.user.role || "user").toLowerCase() };
  //     persistAuth(res.accessToken, safeUser);
  //     dispatch(setAuth({ accessToken: res.accessToken, user: safeUser }));
  //     toast.success(ALERT_MESSAGES.AUTH.GOOGLE_LOGIN_SUCCESS);
  //     navigate("/welcome", { replace: true });
  //   } catch {
  //     toast.error(ALERT_MESSAGES.AUTH.GOOGLE_LOGIN_FAILED);
  //   } finally {
  //     googleLoginInProgress = false;
  //   }
  // };



  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    const res = await authApi.login({
      email: formData.email,
      password: formData.password,
    });

    const safeUser: User = {
      ...res.user,
      role: (res.user.role || "user").toLowerCase() as UserRole,
    };

    persistAuth(
      res.accessToken,
      safeUser
    );

    dispatch(
      setAuth({
        accessToken: res.accessToken,
        user: safeUser,
      })
    );

    toast.success(
      ALERT_MESSAGES.AUTH.LOGIN_SUCCESS
    );

    if (safeUser.role === "admin") {
      navigate("/admin/dashboard", {
        replace: true,
      });
    } else if (
      safeUser.role === "provider"
    ) {
      if (!safeUser.hasAcceptedTerms) {
        navigate("/provider/welcome", {
          replace: true,
        });
      } else {
        navigate("/provider/dashboard", {
          replace: true,
        });
      }
    } else {
      navigate("/welcome", {
        replace: true,
      });
    }
  } catch (err: unknown) {
    const mapped =
      mapApiError(err);

    if (mapped.field) {
      setErrors((prev) => ({
        ...prev,
        [mapped.field as keyof Errors]:
          mapped.message,
      }));
    } else {
      toast.error(
        mapped.message ||
          ALERT_MESSAGES.AUTH.LOGIN_FAILED
      );
    }
  }
};


const handleGoogleSuccess = async (
  cred: CredentialResponse
) => {
  if (
    !cred?.credential ||
    googleLoginInProgress
  ) {
    return;
  }

  googleLoginInProgress = true;

  try {
    const res =
      await authApi.googleLogin(
        cred.credential
      );

    const safeUser: User = {
      ...res.user,
      role: (
        res.user.role || "user"
      ).toLowerCase() as UserRole,
    };

    persistAuth(
      res.accessToken,
      safeUser
    );

    dispatch(
      setAuth({
        accessToken:
          res.accessToken,
        user: safeUser,
      })
    );

    toast.success(
      ALERT_MESSAGES.AUTH
        .GOOGLE_LOGIN_SUCCESS
    );

    if (safeUser.role === "admin") {
      navigate("/admin/dashboard", {
        replace: true,
      });
    } else if (
      safeUser.role === "provider"
    ) {
      if (!safeUser.hasAcceptedTerms) {
        navigate("/provider/welcome", {
          replace: true,
        });
      } else {
        navigate("/provider/dashboard", {
          replace: true,
        });
      }
    } else {
      navigate("/welcome", {
        replace: true,
      });
    }
  } catch {
    toast.error(
      ALERT_MESSAGES.AUTH
        .GOOGLE_LOGIN_FAILED
    );
  } finally {
    googleLoginInProgress =
      false;
  }
};


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden p-14"
          style={{ background: "linear-gradient(145deg, #111 0%, #0a0a0a 100%)" }}
        >
          {/* Vertical ruled lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.1 * i, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 bottom-0 w-px bg-white/[0.04] origin-top"
              style={{ left: `${(i + 1) * 16}%` }}
            />
          ))}

          {/* Giant background letter */}
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-20 -right-10 text-[22rem] font-black leading-none select-none pointer-events-none"
            style={{ color: "rgba(255,255,255,0.025)", fontFamily: "serif" }}
          >
            S
          </motion.div>

          {/* Top logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="text-white/80 text-sm font-light tracking-[0.3em] uppercase">
              Spenzee
            </p>
          </motion.div>

          {/* Center copy */}
          <div className="space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Accent tag */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-px bg-white/40" />
                <span className="text-[10px] text-white/40 tracking-[0.35em] uppercase">
                  Finance Reimagined
                </span>
              </div>

              <h2 className="text-[3.8rem] font-black text-white leading-[0.95] tracking-[-0.03em] uppercase">
                Own<br />
                Your<br />
                <span className="text-white/25">Money.</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-white/30 text-sm leading-relaxed max-w-[260px]"
            >
              Smart expense tracking built for people who take their finances seriously.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex gap-8 pt-4"
            >
              {[["10K+", "Users"], ["99.9%", "Uptime"], ["4.9★", "Rating"]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-white text-lg font-black tracking-tight">{num}</p>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-white/15 text-[10px] tracking-[0.3em] uppercase relative z-10"
          >
            © {new Date().getFullYear()} Spenzee Studios
          </motion.p>
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block w-px bg-white/[0.07] origin-top"
        />

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 xl:px-28 py-20">

          {/* Mobile logo */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:hidden text-white text-sm tracking-[0.3em] uppercase mb-16"
          >
            Spenzee
          </motion.p>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-5">
              Welcome back
            </p>
            <h1 className="text-[3.5rem] sm:text-[4.5rem] font-black text-white tracking-[-0.03em] uppercase leading-[0.9]">
              Sign<br />In.
            </h1>
          </motion.div>

          {/* User / Provider toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex gap-2 mb-12"
          >
            <button
              type="button"
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black"
            >
              User
            </button>
            <button
              type="button"
              onClick={() => navigate("/provider/login")}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border border-white/15 text-white/35 hover:text-white hover:border-white/50 transition-all duration-300"
            >
              Provider
            </button>
          </motion.div>

          {/* Google login */}
          {view === "login" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 max-w-sm"
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error(ALERT_MESSAGES.AUTH.GOOGLE_LOGIN_FAILED)}
              />
            </motion.div>
          )}

          {/* OR divider */}
          {view === "login" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-5 mb-8 max-w-sm"
            >
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-white/20 tracking-[0.25em] uppercase">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="max-w-sm space-y-0"
          >

            {/* Email field */}
            <div className={`group border-t transition-colors duration-300 ${activeField === "email" ? "border-white/60" : "border-white/12"}`}>
              <div className="pt-5 pb-4">
                <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] text-red-400 pb-3"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password field */}
            <div className={`group border-t transition-colors duration-300 ${activeField === "password" ? "border-white/60" : "border-white/12"}`}>
              <div className="pt-5 pb-4">
                <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
                  Password
                </label>
                <div className="flex items-center gap-3">
                  <PasswordInput
  value={formData.password}
  onChange={(value) =>
    setFormData((prev) => ({
      ...prev,
      password: value,
    }))
  }
  onFocus={() =>
    setActiveField("password")
  }
  onBlur={() =>
    setActiveField(null)
  }
  placeholder="Enter your password"
  autoComplete="current-password"
  className="flex-1 bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
/>
                </div>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] text-red-400 pb-3"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Forgot password */}
            <div className="border-t border-white/12 py-4 flex justify-between items-center">
              <span className="text-[9px] text-white/15 tracking-widest uppercase">
                Credentials
              </span>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[10px] text-white/25 hover:text-white/70 transition-colors tracking-widest uppercase"
              >
                Forgot?
              </button>
            </div>

            {/* Submit */}
            <div className="border-t border-white/12 pt-10">
              <motion.button
                type="submit"
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-5"
              >
                <motion.span
                  variants={{ hover: { x: 4 } }}
                  transition={{ duration: 0.2 }}
                  className="text-[2.8rem] font-black text-white uppercase tracking-[-0.03em] leading-none"
                >
                  Go
                </motion.span>

                {/* Animated arrow box */}
                <motion.div
                  variants={{ hover: { x: 8, backgroundColor: "#ffffff" } }}
                  transition={{ duration: 0.25 }}
                  className="w-12 h-12 border border-white/30 flex items-center justify-center"
                >
                  <motion.svg
                    variants={{ hover: { x: 2 } }}
                    transition={{ duration: 0.2 }}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white group-hover:text-black transition-colors duration-250"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </motion.div>

                {/* Full text beside */}
                <motion.span
                  variants={{ hover: { opacity: 1, x: 0 } }}
                  initial={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] text-white/30 uppercase tracking-[0.25em] hidden sm:block"
                >
                  Sign in
                </motion.span>
              </motion.button>
            </div>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-16 max-w-sm border-t border-white/8 pt-8 flex items-center justify-between"
          >
            <p className="text-[10px] text-white/20 tracking-widest uppercase">
              New here?
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="text-[10px] text-white/40 hover:text-white transition-colors tracking-widest uppercase underline underline-offset-4"
            >
              Create account →
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

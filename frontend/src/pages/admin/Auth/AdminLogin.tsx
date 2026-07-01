

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import toast from "react-hot-toast";

import { adminAuthApi } from "../../../api/admin/adminAuth.api";

import { useDispatch, useSelector } from "react-redux";
import PasswordInput from "../../../components/common/PasswordInput";
import {
  setAdminAuth,
} from "../../../store/admin/adminAuth.slice";

import {
  persistAdminAuth,
} from "../../../store/admin/adminAuthStorage";

import type { RootState } from "../../../store/store";

import { ROUTES } from "../../../constants/routes";

import { mapApiError } from "../../../util/errorHandler";

// const EyeIcon = ({ open }: { open: boolean }) =>
//   open ? (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
//       <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="2" />
//     </svg>
//   ) : (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" stroke="currentColor" strokeWidth="2" />
//       <path d="M6.35 6.35C4.31 7.72 2.85 9.68 2 12c1.73 4.39 6 7.5 10 7.5 1.55 0 3.03-.37 4.35-1.02" stroke="currentColor" strokeWidth="2" />
//       <path d="M17.94 17.94A9.96 9.96 0 0022 12c-1.73-4.39-6-7.5-10-7.5-1.3 0-2.55.24-3.7.68" stroke="currentColor" strokeWidth="2" />
//     </svg>
//   );

/* Animated background grid lines */
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-white/20 to-transparent" />
    <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-white/20 to-transparent" />
    <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-white/20 to-transparent" />
    <div className="absolute bottom-0 right-0 w-px h-32 bg-gradient-to-t from-white/20 to-transparent" />
  </div>
);

const inputCls =
  "w-full bg-white/5 border-b border-white/15 py-3 px-4 text-white placeholder-white/25 focus:outline-none focus:border-white/60 transition-colors duration-300 text-sm tracking-wide";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    isAuthenticated,
    admin,
  } = useSelector(
    (state: RootState) => state.adminAuth
  );

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // const [showPassword, setShowPassword] =
  //   useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState<{
      email?: string;
      password?: string;
    }>({});

  const [focused, setFocused] =
    useState<string | null>(null);

  useEffect(() => {
    if (
      isAuthenticated &&
      admin
    ) {
      navigate(
        ROUTES.ADMIN.DASHBOARD,
        { replace: true }
      );
    }
  }, [
    isAuthenticated,
    admin,
    navigate,
  ]);

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setErrors({});

    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email =
        "Email required";
    }

    if (!password.trim()) {
      newErrors.password =
        "Password required";
    }

    if (
      Object.keys(newErrors)
        .length
    ) {
      setErrors(newErrors);

      return;
    }

    setLoading(true);

    try {
      const data =
        await adminAuthApi.login({
          email,
          password,
        });

      persistAdminAuth(
        data.accessToken,
        data.admin
      );

      dispatch(
        setAdminAuth({
          accessToken:
            data.accessToken,

          admin:
            data.admin,
        })
      );

      toast.success(
        "Admin authenticated"
      );

      navigate(
        ROUTES.ADMIN.DASHBOARD,
        { replace: true }
      );
    } catch (
      err: unknown
    ) {
      const mapped =
        mapApiError(err);

      if (mapped.field) {
        setErrors({
          [mapped.field]:
            mapped.message,
        });
      } else {
        toast.error(
          mapped.message ||
            "Invalid admin credentials"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const easeOutQuart = [0.22, 1, 0.36, 1] as const;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 16,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.7,
        ease: easeOutQuart,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 overflow-hidden">
      <GridBackground />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">
          Spenzee
        </h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 h-px w-24 mx-auto bg-white/20 origin-left"
        />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Top border accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-px left-8 right-8 h-px bg-white/30 origin-left"
        />

        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.8)]">

          {/* Header */}
          <motion.header
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-10 text-center"
          >
            {/* Admin badge */}
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-1.5 border border-white/15 rounded-full bg-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] text-white/50 uppercase tracking-[0.3em]">
                  Restricted Access
                </span>
              </div>
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-2xl text-white font-light tracking-tight">
              Admin Panel
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xs text-white/30 tracking-[0.25em] uppercase mt-2">
              Authorized personnel only
            </motion.p>
          </motion.header>

          {/* Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={submit}
            className="space-y-6"
          >
            {/* Email */}
            <motion.div variants={itemVariants}>
              <div
                className={`relative transition-all duration-300 ${
                  focused === "email" ? "opacity-100" : "opacity-80"
                }`}
              >
                <label className="block text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="admin@spenzee.com"
                  className={inputCls}
                  autoComplete="email"
                />
                {focused === "email" && (
                  <motion.div
                    layoutId="focus-line"
                    className="absolute bottom-0 left-0 right-0 h-px bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-400 mt-2 pl-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

        {/* Password */}
<motion.div variants={itemVariants}>
  <div
    className={`relative transition-all duration-300 ${
      focused === "password"
        ? "opacity-100"
        : "opacity-80"
    }`}
  >
    <label className="block text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2">
      Password
    </label>

    <PasswordInput
      value={password}
      onChange={(value) => {
        setPassword(value);

        setErrors((prev) => ({
          ...prev,
          password: undefined,
        }));
      }}
      onFocus={() =>
        setFocused("password")
      }
      onBlur={() =>
        setFocused(null)
      }
      placeholder="••••••••••••"
      autoComplete="current-password"
      className={inputCls}
    />

    {focused ===
      "password" && (
      <motion.div
        layoutId="focus-line"
        className="absolute bottom-0 left-0 right-0 h-px bg-white"
        initial={{
          scaleX: 0,
        }}
        animate={{
          scaleX: 1,
        }}
        transition={{
          duration: 0.3,
        }}
      />
    )}
  </div>

  <AnimatePresence>
    {errors.password && (
      <motion.p
        initial={{
          opacity: 0,
          height: 0,
        }}
        animate={{
          opacity: 1,
          height: "auto",
        }}
        exit={{
          opacity: 0,
          height: 0,
        }}
        className="text-xs text-red-400 mt-2 pl-1"
      >
        {errors.password}
      </motion.p>
    )}
  </AnimatePresence>
</motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="relative w-full py-4 bg-white text-black text-xs font-medium tracking-[0.25em] uppercase hover:bg-white/90 transition-colors duration-300 disabled:opacity-40 overflow-hidden"
              >
                {/* Loading bar */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                    />
                  )}
                </AnimatePresence>
                {loading ? "Verifying..." : "Enter Admin Panel"}
              </motion.button>
            </motion.div>
          </motion.form>
        </div>

        {/* Bottom border accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-px left-8 right-8 h-px bg-white/10 origin-right"
        />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-12 text-white/20 text-[10px] tracking-[0.3em] uppercase"
      >
        &copy; {new Date().getFullYear()} Spenzee Studios
      </motion.div>
    </div>
  );
};

export default AdminLogin;

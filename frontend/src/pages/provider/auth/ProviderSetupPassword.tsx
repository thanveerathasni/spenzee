



import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { mapApiError } from "../../../util/errorHandler";
import { ROUTES } from "../../../constants/routes";
import { Navbar } from "../../public/Landing";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../../store/auth";
const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" stroke="currentColor" strokeWidth="2" />
      <path d="M6.35 6.35C4.31 7.72 2.85 9.68 2 12c1.73 4.39 6 7.5 10 7.5 1.55 0 3.03-.37 4.35-1.02" stroke="currentColor" strokeWidth="2" />
      <path d="M17.94 17.94A9.96 9.96 0 0022 12c-1.73-4.39-6-7.5-10-7.5-1.3 0-2.55.24-3.7.68" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

export default function ProviderSetupPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
const dispatch = useDispatch();
  // ── ALL ORIGINAL LOGIC UNCHANGED ──
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing setup token");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/provider/auth/setup-password", { token, newPassword: password });
      toast.success("Password setup successful!");
      dispatch(clearAuth());
localStorage.removeItem("accessToken");
      navigate(ROUTES.PROVIDER.LOGIN);
    } catch (err: unknown) {
      const mapped = mapApiError(err);
      toast.error(mapped.message || "Failed to setup password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-5">Setup Link</p>
            <h1 className="text-[3rem] font-black text-white tracking-[-0.03em] uppercase leading-[0.9] mb-6">
              Invalid<br />Link.
            </h1>
            <p className="text-white/30 text-sm mb-10">
              This setup link is missing or has expired. Please request a new one.
            </p>
            <button
              onClick={() => navigate(ROUTES.PROVIDER.LOGIN)}
              className="text-[10px] text-white/40 hover:text-white transition-colors tracking-widest uppercase underline underline-offset-4"
            >
              Back to login →
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  // ── MAIN UI ──
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

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
          style={{ background: "linear-gradient(145deg,#111 0%,#0a0a0a 100%)" }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.1 * i, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 bottom-0 w-px bg-white/[0.04] origin-top"
              style={{ left: `${(i + 1) * 16}%` }}
            />
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-20 -right-10 text-[22rem] font-black leading-none select-none pointer-events-none"
            style={{ color: "rgba(255,255,255,0.025)", fontFamily: "serif" }}
          >
            S
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/80 text-sm font-light tracking-[0.3em] uppercase"
          >
            Spenzee
          </motion.p>

          <div className="space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-px bg-white/40" />
                <span className="text-[10px] text-white/40 tracking-[0.35em] uppercase">Provider Onboarding</span>
              </div>
              <h2 className="text-[3.8rem] font-black text-white leading-[0.95] tracking-[-0.03em] uppercase">
                Almost<br />There,<br /><span className="text-white/25">Partner.</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-white/30 text-sm leading-relaxed max-w-[260px]"
            >
              Create a strong password to secure your provider account and get started.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex gap-8 pt-4"
            >
              {[["1", "Step"], ["2 min", "Setup"], ["100%", "Secure"]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-white text-lg font-black tracking-tight">{num}</p>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-white/15 text-[10px] tracking-[0.3em] uppercase relative z-10"
          >
            © {new Date().getFullYear()} Spenzee Studios
          </motion.p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block w-px bg-white/[0.07] origin-top"
        />

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 xl:px-28 py-20">

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="lg:hidden text-white text-sm tracking-[0.3em] uppercase mb-16"
          >
            Spenzee
          </motion.p>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-5">
              Account setup
            </p>
            <h1 className="text-[3.5rem] sm:text-[4.5rem] font-black text-white tracking-[-0.03em] uppercase leading-[0.9]">
              Set<br />Pass.
            </h1>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="max-w-sm"
          >
            {/* New Password */}
            <div className={`border-t transition-colors duration-300 ${activeField === "password" ? "border-white/60" : "border-white/10"}`}>
              <div className="pt-5 pb-4">
                <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
                  New Password
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setActiveField("password")}
                    onBlur={() => setActiveField(null)}
                    placeholder="Create a strong password"
                    required
                    className="flex-1 bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-white/25 hover:text-white/70 transition-colors shrink-0"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className={`border-t transition-colors duration-300 ${activeField === "confirm" ? "border-white/60" : "border-white/10"}`}>
              <div className="pt-5 pb-4">
                <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
                  Confirm Password
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setActiveField("confirm")}
                    onBlur={() => setActiveField(null)}
                    placeholder="Repeat your password"
                    required
                    className="flex-1 bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="text-white/25 hover:text-white/70 transition-colors shrink-0"
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
              </div>
              {/* Live match indicator */}
              <AnimatePresence>
                {confirmPassword.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className={`text-[11px] pb-3 ${password === confirmPassword ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/10 py-4">
              <span className="text-[9px] text-white/15 tracking-widest uppercase">
                Secure your account
              </span>
            </div>

            {/* Submit */}
            <div className="border-t border-white/10 pt-10">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover="hover" whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-5"
              >
                <motion.span
                  variants={{ hover: { x: 4 } }} transition={{ duration: 0.2 }}
                  className="text-[2.8rem] font-black text-white uppercase tracking-[-0.03em] leading-none"
                >
                  {loading ? "..." : "Save"}
                </motion.span>
                <motion.div
                  variants={{ hover: { x: 8, backgroundColor: "#ffffff" } }}
                  transition={{ duration: 0.25 }}
                  className="w-12 h-12 border border-white/30 flex items-center justify-center"
                >
                  <motion.svg
                    variants={{ hover: { x: 2 } }} transition={{ duration: 0.2 }}
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    className="text-white group-hover:text-black transition-colors duration-250"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </motion.div>
                <motion.span
                  variants={{ hover: { opacity: 1, x: 0 } }}
                  initial={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}
                  className="text-[10px] text-white/30 uppercase tracking-[0.25em] hidden sm:block"
                >
                  {loading ? "Setting up..." : "Complete setup"}
                </motion.span>
              </motion.button>
            </div>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-16 max-w-sm border-t border-white/8 pt-8 flex items-center justify-between"
          >
            <p className="text-[10px] text-white/20 tracking-widest uppercase">Already set up?</p>
            <button
              onClick={() => navigate(ROUTES.PROVIDER.LOGIN)}
              className="text-[10px] text-white/40 hover:text-white transition-colors tracking-widest uppercase underline underline-offset-4"
            >
              Sign in →
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
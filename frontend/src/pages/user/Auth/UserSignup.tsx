



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../public/Landing";
import { signupSchema } from "../../../validation/signupSchema";
import { authApi } from "../../../api/auth.api";
import toast from "react-hot-toast";
import { ALERT_MESSAGES } from "../../../constants/messages";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { mapApiError } from "../../../util/errorHandler";
import { ROUTES } from "../../../constants/routes";
import { motion, AnimatePresence } from "framer-motion";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
}

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

const SignupForm: React.FC = () => {
  const navigate = useNavigate();

  const [showOtpField, setShowOtpField] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", otp: "" });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.USER.WELCOME, { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "otp" ? value.replace(/\D/g, "").slice(0, 6) : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const runZodValidation = () => {
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Errors = {};
      (Object.keys(fieldErrors) as (keyof Errors)[]).forEach((key) => { newErrors[key] = fieldErrors[key]?.[0]; });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const validateOtp = () => {
    if (!formData.otp || formData.otp.length !== 6) { setErrors({ otp: "Enter valid 6-digit OTP" }); return false; }
    return true;
  };

  useEffect(() => {
    if (!showOtpField) return;
    if (otpTimer === 0) { setCanResend(true); return; }
    const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpTimer, showOtpField]);

  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    try {
      await authApi.resendOtp({ email: formData.email, name: formData.name, password: formData.password, role: "user" });
      toast.success(`${ALERT_MESSAGES.AUTH.OTP_RESEND_SUCCESS} to ${formData.email}`);
      setOtpTimer(60);
      setCanResend(false);
    } catch (err: unknown) {
      toast.error(mapApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!showOtpField) {
      if (!runZodValidation()) { setLoading(false); return; }
      try {
        await authApi.resendOtp({ email: formData.email, name: formData.name, password: formData.password, role: "user" });
        toast.success(ALERT_MESSAGES.AUTH.OTP_SENT);
        setShowOtpField(true);
        setOtpTimer(60);
        setCanResend(false);
        setErrors({});
      } catch (err: unknown) {
        const mapped = mapApiError(err);
        if (mapped.field) setErrors({ [mapped.field]: mapped.message });
        else toast.error(mapped.message);
      } finally { setLoading(false); }
    } else {
      if (!validateOtp()) { setLoading(false); return; }
      try {
        await authApi.verifyOtp({ email: formData.email, otp: formData.otp });
        await authApi.signup({ name: formData.name, email: formData.email, password: formData.password, role: "user" });
        toast.success(ALERT_MESSAGES.AUTH.OTP_VERIFICATION_SUCCESS);
        navigate(ROUTES.AUTH.LOGIN, { replace: true });
      } catch (err: unknown) {
        const mapped = mapApiError(err);
        if (mapped.field) {
          setErrors({ [mapped.field]: mapped.message });
          if (mapped.message.toLowerCase().includes("expired") || mapped.message.toLowerCase().includes("attempts")) setCanResend(true);
        } else toast.error(mapped.message);
      } finally { setLoading(false); }
    }
  };

  /* ── inline field row ── */
  const FieldRow = ({
    id, label, type = "text", value, name, placeholder, autoComplete, rightSlot, error,
  }: {
    id: string; label: string; shortLabel: string; type?: string; value: string; name: string;
    placeholder: string; autoComplete?: string; rightSlot?: React.ReactNode; error?: string;
  }) => (
    <div className={`border-t transition-colors duration-300 ${activeField === id ? "border-white/60" : "border-white/10"}`}>
      <div className="pt-5 pb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <input
            type={type} name={name} value={value} onChange={handleChange}
            onFocus={() => setActiveField(id)} onBlur={() => setActiveField(null)}
            placeholder={placeholder} autoComplete={autoComplete}
            className="flex-1 bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
          />
          {rightSlot}
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-red-400 pb-3"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

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
                <span className="text-[10px] text-white/40 tracking-[0.35em] uppercase">Start Your Journey</span>
              </div>
              <h2 className="text-[3.8rem] font-black text-white leading-[0.95] tracking-[-0.03em] uppercase">
                Join<br />The<br /><span className="text-white/25">Future.</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-white/30 text-sm leading-relaxed max-w-[260px]"
            >
              Create your account and start taking control of your finances in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex gap-8 pt-4"
            >
              {[["Free", "Forever"], ["2 min", "Setup"], ["100%", "Secure"]].map(([num, label]) => (
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
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 xl:px-28 py-20 overflow-y-auto">

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
              {showOtpField ? `Code sent to ${formData.email}` : "New account"}
            </p>
            <h1 className="text-[3rem] sm:text-[4rem] font-black text-white tracking-[-0.03em] uppercase leading-[0.9]">
              <AnimatePresence mode="wait">
                {!showOtpField ? (
                  <motion.span key="signup-title"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="block"
                  >
                    Sign<br />Up.
                  </motion.span>
                ) : (
                  <motion.span key="otp-title"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="block"
                  >
                    Verify<br />Email.
                  </motion.span>
                )}
              </AnimatePresence>
            </h1>
          </motion.div>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex gap-2 mb-10"
          >
            <button type="button"
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black"
            >
              User
            </button>
            <button type="button" onClick={() => navigate("/provider/request")}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border border-white/15 text-white/35 hover:text-white hover:border-white/50 transition-all duration-300"
            >
              Provider
            </button>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-sm"
          >
            <AnimatePresence mode="wait">
              {!showOtpField ? (
                <motion.form key="signup-form"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onSubmit={handleSubmit}
                >
                  <FieldRow id="name" label="Full Name" shortLabel="Name"
                    name="name" value={formData.name} placeholder="Your full name"
                    autoComplete="name" error={errors.name}
                  />
                  <FieldRow id="email" label="Email Address" shortLabel="Email" type="email"
                    name="email" value={formData.email} placeholder="you@example.com"
                    autoComplete="email" error={errors.email}
                  />
                  <FieldRow id="password" label="Password" shortLabel="Pass" type={showPassword ? "text" : "password"}
                    name="password" value={formData.password} placeholder="Create a password"
                    autoComplete="new-password" error={errors.password}
                    rightSlot={
                      <button type="button" onClick={() => setShowPassword((p) => !p)}
                        className="text-white/25 hover:text-white/70 transition-colors shrink-0"
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    }
                  />
                  <FieldRow id="confirm" label="Confirm Password" shortLabel="Confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword" value={formData.confirmPassword}
                    placeholder="Repeat your password" autoComplete="new-password"
                    error={errors.confirmPassword}
                    rightSlot={
                      <button type="button" onClick={() => setShowConfirmPassword((p) => !p)}
                        className="text-white/25 hover:text-white/70 transition-colors shrink-0"
                      >
                        <EyeIcon open={showConfirmPassword} />
                      </button>
                    }
                  />

                  {/* Submit */}
                  <div className="border-t border-white/10 pt-10">
                    <motion.button type="submit" disabled={loading}
                      whileHover="hover" whileTap={{ scale: 0.97 }}
                      className="group flex items-center gap-5"
                    >
                      <motion.span variants={{ hover: { x: 4 } }} transition={{ duration: 0.2 }}
                        className="text-[2.8rem] font-black text-white uppercase tracking-[-0.03em] leading-none"
                      >
                        {loading ? "..." : "Go"}
                      </motion.span>
                      <motion.div variants={{ hover: { x: 8, backgroundColor: "#ffffff" } }}
                        transition={{ duration: 0.25 }}
                        className="w-12 h-12 border border-white/30 flex items-center justify-center"
                      >
                        <motion.svg variants={{ hover: { x: 2 } }} transition={{ duration: 0.2 }}
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
                        {loading ? "Processing..." : "Create account"}
                      </motion.span>
                    </motion.button>
                  </div>

                  <div className="border-t border-white/8 mt-10 pt-8 flex items-center justify-between">
                    <p className="text-[10px] text-white/20 tracking-widest uppercase">Have an account?</p>
                    <button type="button" onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                      className="text-[10px] text-white/40 hover:text-white transition-colors tracking-widest uppercase underline underline-offset-4"
                    >
                      Sign in →
                    </button>
                  </div>
                </motion.form>
              ) : (
                /* ── OTP STEP ── */
                <motion.form key="otp-form"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onSubmit={handleSubmit}
                >
                  {/* OTP dot progress */}
                  <div className="flex gap-3 mb-10">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div key={i}
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ delay: i * 0.06, duration: 0.35, ease: "backOut" }}
                        className={`h-1 flex-1 transition-colors duration-300 ${
                          i < formData.otp.length ? "bg-white" : "bg-white/15"
                        }`}
                      />
                    ))}
                  </div>

                  <div className={`border-t transition-colors duration-300 ${activeField === "otp" ? "border-white/60" : "border-white/10"}`}>
                    <div className="pt-5 pb-4">
                      <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
                        Verification Code
                      </label>
                      <input
                        name="otp" value={formData.otp} onChange={handleChange}
                        onFocus={() => setActiveField("otp")} onBlur={() => setActiveField(null)}
                        placeholder="000000" maxLength={6} inputMode="numeric"
                        className="w-full bg-transparent text-white text-2xl font-black tracking-[0.5em] placeholder-white/15 focus:outline-none"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.otp && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className="text-[11px] text-red-400 pb-3"
                        >
                          {errors.otp}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Timer / resend */}
                  <div className="border-t border-white/10 py-4 flex justify-between items-center">
                    <span className="text-[9px] text-white/15 tracking-widest uppercase">One-time code</span>
                    {!canResend ? (
                      <span className="text-[10px] text-white/25 tracking-widest uppercase tabular-nums">
                        Resend in {otpTimer}s
                      </span>
                    ) : (
                      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        type="button" onClick={handleResendOtp} disabled={loading}
                        className="text-[10px] text-white/40 hover:text-white transition-colors tracking-widest uppercase underline underline-offset-4"
                      >
                        Resend code
                      </motion.button>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="border-t border-white/10 pt-10">
                    <motion.button type="submit" disabled={loading}
                      whileHover="hover" whileTap={{ scale: 0.97 }}
                      className="group flex items-center gap-5"
                    >
                      <motion.span variants={{ hover: { x: 4 } }} transition={{ duration: 0.2 }}
                        className="text-[2.8rem] font-black text-white uppercase tracking-[-0.03em] leading-none"
                      >
                        {loading ? "..." : "Go"}
                      </motion.span>
                      <motion.div variants={{ hover: { x: 8, backgroundColor: "#ffffff" } }}
                        transition={{ duration: 0.25 }}
                        className="w-12 h-12 border border-white/30 flex items-center justify-center"
                      >
                        <motion.svg variants={{ hover: { x: 2 } }} transition={{ duration: 0.2 }}
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
                        {loading ? "Verifying..." : "Verify email"}
                      </motion.span>
                    </motion.button>
                  </div>

                  <div className="border-t border-white/8 mt-10 pt-8">
                    <button type="button"
                      onClick={() => { setShowOtpField(false); setErrors({}); }}
                      className="text-[10px] text-white/25 hover:text-white/60 transition-colors tracking-widest uppercase"
                    >
                      ← Back to sign up
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SignupForm;

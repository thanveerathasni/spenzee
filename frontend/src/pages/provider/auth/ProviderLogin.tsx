










import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { providerAuthApi } from "../../../api/provider/providerAuth.api";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/auth/auth.slice";
import { Navbar } from "../../public/Landing";
import { motion, AnimatePresence } from "framer-motion";
import PasswordInput from "../../../components/common/PasswordInput";
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

export default function ProviderLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [activeField, setActiveField] = useState<string | null>(null);

  // ── ALL ORIGINAL LOGIC UNCHANGED ──
  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "Email required";
    if (!password.trim()) newErrors.password = "Password required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const { accessToken, provider } = await providerAuthApi.login(email, password);
      dispatch(setAuth({ accessToken, user: { ...provider, role: "provider" } }));
      toast.success("Login success");
      if (provider.hasAcceptedTerms) {
        navigate("/provider/dashboard");
      } else {
        navigate("/provider/welcome", { replace: true });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;
        if (msg === "Account pending approval") navigate("/provider/pending");
        toast.error(msg || "Login failed");
      }
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
            P
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
                <span className="text-[10px] text-white/40 tracking-[0.35em] uppercase">Provider Portal</span>
              </div>
              <h2 className="text-[3.8rem] font-black text-white leading-[0.95] tracking-[-0.03em] uppercase">
                Power<br />Your<br /><span className="text-white/25">Brand.</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-white/30 text-sm leading-relaxed max-w-[260px]"
            >
              Access your provider dashboard and manage your offerings on Spenzee.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
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
            className="mb-12"
          >
            <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-5">
              Provider portal
            </p>
            <h1 className="text-[3.5rem] sm:text-[4.5rem] font-black text-white tracking-[-0.03em] uppercase leading-[0.9]">
              Sign<br />In.
            </h1>
          </motion.div>

          {/* User / Provider toggle */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex gap-2 mb-12"
          >
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border border-white/15 text-white/35 hover:text-white hover:border-white/50 transition-all duration-300"
            >
              User
            </button>
            <button
              type="button"
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black"
            >
              Provider
            </button>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleLogin}
            className="max-w-sm"
          >
            {/* Email */}
            <div className={`border-t transition-colors duration-300 ${activeField === "email" ? "border-white/60" : "border-white/10"}`}>
              <div className="pt-5 pb-4">
                <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] text-red-400 pb-3"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

           {/* Password */}
<div
  className={`border-t transition-colors duration-300 ${
    activeField === "password"
      ? "border-white/60"
      : "border-white/10"
  }`}
>
  <div className="pt-5 pb-4">
    <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
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
        setActiveField(
          "password"
        )
      }
      onBlur={() =>
        setActiveField(
          null,
        )
      }
      placeholder="Enter your password"
      autoComplete="current-password"
      className="flex-1 bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
    />
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
        className="text-[11px] text-red-400 pb-3"
      >
        {errors.password}
      </motion.p>
    )}
  </AnimatePresence>
</div>

            {/* Forgot password */}
            <div className="border-t border-white/10 py-4 flex justify-between items-center">
              <span className="text-[9px] text-white/15 tracking-widest uppercase">Credentials</span>
              <button
                type="button"
                onClick={() => navigate("/provider/forgot-password")}
                className="text-[10px] text-white/25 hover:text-white/70 transition-colors tracking-widest uppercase"
              >
                Forgot?
              </button>
            </div>

            {/* Submit */}
            <div className="border-t border-white/10 pt-10">
              <motion.button
                type="submit"
                whileHover="hover" whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-5"
              >
                <motion.span
                  variants={{ hover: { x: 4 } }} transition={{ duration: 0.2 }}
                  className="text-[2.8rem] font-black text-white uppercase tracking-[-0.03em] leading-none"
                >
                  Go
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
                  Sign in
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
            <p className="text-[10px] text-white/20 tracking-widest uppercase">Not a provider?</p>
            <button
              onClick={() => navigate("/login")}
              className="text-[10px] text-white/40 hover:text-white transition-colors tracking-widest uppercase underline underline-offset-4"
            >
              User login →
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
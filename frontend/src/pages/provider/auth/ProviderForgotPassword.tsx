










import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "../../public/Landing";
import { providerAuthApi } from "../../../api/provider/providerAuth.api";
import toast from "react-hot-toast";
import { ALERT_MESSAGES } from "../../../constants/messages";

type Step = "EMAIL" | "SUCCESS";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await providerAuthApi.forgotPassword(email);
      toast.success(ALERT_MESSAGES.AUTH.FORGOT_PASSWORD_SUCCESS);
      setStep("SUCCESS");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        ALERT_MESSAGES.AUTH.FORGOT_PASSWORD_FAILED;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
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
            transition={{ delay: 0.4, duration: 1.5 }}
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
                <span className="text-[10px] text-white/40 tracking-[0.35em] uppercase">Account Recovery</span>
              </div>
              <h2 className="text-[3.8rem] font-black text-white leading-[0.95] tracking-[-0.03em] uppercase">
                Reset<br />Your<br /><span className="text-white/25">Access.</span>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-white/30 text-sm leading-relaxed max-w-[260px]"
            >
              We'll send a secure link directly to your inbox. Back in seconds.
            </motion.p>
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

          <AnimatePresence mode="wait">
            {step === "EMAIL" ? (
              <motion.div key="email-step"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Heading */}
                <div className="mb-10">
                  <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-5">
                    Password recovery
                  </p>
                  <h1 className="text-[3.5rem] sm:text-[4.5rem] font-black text-white tracking-[-0.03em] uppercase leading-[0.9]">
                    Forgot<br />Pass.
                  </h1>
                </div>

                <form onSubmit={handleSubmit} className="max-w-sm">
                  {/* Email field */}
                  <div className={`border-t transition-colors duration-300 ${activeField ? "border-white/60" : "border-white/10"}`}>
                    <div className="pt-5 pb-4">
                      <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
                        Email Address
                      </label>
                      <input
                        type="email" value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        onFocus={() => setActiveField(true)}
                        onBlur={() => setActiveField(false)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
                      />
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

                  <div className="border-t border-white/10 py-4 flex justify-between items-center">
                    <span className="text-[9px] text-white/15 tracking-widest uppercase">Registered email</span>
                    <Link to="/login"
                      className="text-[10px] text-white/25 hover:text-white/60 transition-colors tracking-widest uppercase"
                    >
                      Back to login
                    </Link>
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
                        {loading ? "..." : "Send"}
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
                        {loading ? "Sending..." : "Send reset link"}
                      </motion.span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* ── SUCCESS STEP ── */
              <motion.div key="success-step"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-sm"
              >
                <div className="mb-10">
                  <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-5">
                    Email dispatched
                  </p>
                  <h1 className="text-[3.5rem] sm:text-[4.5rem] font-black text-white tracking-[-0.03em] uppercase leading-[0.9]">
                    Check<br />Inbox.
                  </h1>
                </div>

                {/* Animated check */}
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
                  className="w-16 h-16 border border-white/20 flex items-center justify-center mb-10"
                >
                  <motion.svg
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    />
                  </motion.svg>
                </motion.div>

                <p className="text-white/30 text-sm leading-relaxed mb-10 max-w-[280px]">
                  We sent a password reset link to your email. Follow the instructions to regain access.
                </p>

                <div className="border-t border-white/10 pt-10">
                  <motion.button
                    onClick={() => navigate("/provider/login")}
                    whileHover="hover" whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-5"
                  >
                    <motion.span variants={{ hover: { x: 4 } }} transition={{ duration: 0.2 }}
                      className="text-[2.8rem] font-black text-white uppercase tracking-[-0.03em] leading-none"
                    >
                      Login
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
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
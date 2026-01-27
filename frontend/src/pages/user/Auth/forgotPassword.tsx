import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "../../public/Landing";
import { authApi } from "../../../api/auth.api";
import toast from "react-hot-toast";

/* ---------------- Types ---------------- */
type Step = "EMAIL" | "SUCCESS";

/* ---------------- Component ---------------- */
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  /* -------- State -------- */
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------- Handlers -------- */

  // STEP 1: Send reset link (TOKEN BASED)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      toast.success("Password reset link sent to your email");
      setStep("SUCCESS");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Failed to send password reset email";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* -------- UI Helpers (UNCHANGED) -------- */

  const InputField = ({
    label,
    type,
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    type: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  }) => (
    <div className="mb-6">
      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full bg-[#1A1A1A] border-b border-white/10 py-3 px-4 text-white focus:outline-none focus:border-white/40 transition-colors duration-300 placeholder:text-gray-700"
      />
    </div>
  );

  const PrimaryButton = ({ label }: { label: string }) => (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-4 mt-4 bg-white text-black font-medium tracking-wide transition-all duration-300 hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "PROCESSING..." : label.toUpperCase()}
    </button>
  );

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen flex flex-col items-center p-6 font-sans pt-24 sm:pt-28 lg:pt-32">
      <Navbar />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="mt-6 sm:mt-10 lg:mt-16 text-4xl md:text-5xl font-serif text-white mb-10 sm:mb-12 tracking-tighter"
      >
        Spenzee
      </motion.h1>

      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="wait">
          {/* STEP 1: EMAIL */}
          {step === "EMAIL" && (
            <motion.form
              key="email-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSubmit}
            >
              <h2 className="text-xl text-white mb-2 font-light">
                Forgot Password
              </h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Enter your registered email address and we’ll send you a secure
                password reset link.
              </p>

              <InputField
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="name@example.com"
              />

              {error && (
                <p className="text-red-500 text-xs mb-4">{error}</p>
              )}

              <PrimaryButton label="Send Reset Link" />

              <div className="mt-8 text-center">
                <Link
                  to="/login"
                  className="text-gray-500 text-xs hover:text-white transition-colors tracking-widest uppercase"
                >
                  Back to Login
                </Link>
              </div>
            </motion.form>
          )}

          {/* STEP 2: SUCCESS */}
          {step === "SUCCESS" && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-xl text-white mb-2 font-light">
                Check Your Email
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                We’ve sent a password reset link to your email. Please follow the
                instructions to reset your password.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="w-full py-4 bg-white text-black font-medium tracking-wide hover:bg-gray-200 transition"
              >
                RETURN TO LOGIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-12 text-gray-700 text-[10px] tracking-[0.2em] uppercase">
        &copy; {new Date().getFullYear()} Spenzee Studios
      </footer>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../../public/Landing';
import api from '../../../api/axios';

// --- Types & Interfaces ---
type Step = 'EMAIL' | 'OTP' | 'RESET' | 'SUCCESS';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  // --- State Management ---
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Validation Helpers ---
  const validatePassword = (pass: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  // =========================
  // API HANDLERS
  // =========================

  // STEP 1: Request OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setStep('OTP');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError('Please enter a 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/verify-forgot-otp', { email, otp });
      setStep('RESET');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Invalid or expired OTP.'
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError(
        'Password must be 8+ chars with uppercase, lowercase, number, and symbol.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        email,
        newPassword: password,
      });
      setStep('SUCCESS');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Could not reset password.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI COMPONENTS
  // =========================

  const InputField = ({
    label,
    type,
    value,
    onChange,
    placeholder,
    maxLength,
  }: any) => (
    <div className="mb-6">
      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required
        className="w-full bg-[#1A1A1A] border-b border-white/10 py-3 px-4 text-white focus:outline-none focus:border-white/40 transition-colors duration-300 placeholder:text-gray-700"
      />
    </div>
  );

  const PrimaryButton = ({ label }: any) => (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-4 mt-4 bg-white text-black font-medium tracking-wide transition-all duration-300 hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'PROCESSING...' : label.toUpperCase()}
    </button>
  );

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen flex flex-col items-center p-6 font-sans pt-24 sm:pt-28 lg:pt-32">
      <Navbar />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="mt-6 sm:mt-10 lg:mt-16 text-4xl md:text-5xl font-serif text-white mb-10 sm:mb-12 tracking-tighter"
      >
        Spenzee
      </motion.h1>

      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="wait">
          {/* STEP 1: EMAIL */}
          {step === 'EMAIL' && (
            <motion.form
              key="email-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSendOTP}
            >
              <h2 className="text-xl text-white mb-2 font-light">
                Forgot Password
              </h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Enter your registered email address to receive a recovery code.
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

              <PrimaryButton label="Send OTP" />

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

          {/* STEP 2: OTP */}
          {step === 'OTP' && (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleVerifyOTP}
            >
              <h2 className="text-xl text-white mb-2 font-light">
                Verify Identity
              </h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                We've sent a 6-digit code to{' '}
                <span className="text-white">{email}</span>.
              </p>

              <InputField
                label="Verification Code"
                type="text"
                value={otp}
                onChange={setOtp}
                placeholder="000000"
                maxLength={6}
              />

              {error && (
                <p className="text-red-500 text-xs mb-4">{error}</p>
              )}

              <PrimaryButton label="Verify OTP" />

              <button
                type="button"
                onClick={() => {
                  setStep('EMAIL');
                  setError('');
                }}
                className="w-full mt-4 text-gray-500 text-xs hover:text-white transition-colors tracking-widest uppercase"
              >
                Change Email
              </button>
            </motion.form>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 'RESET' && (
            <motion.form
              key="reset-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleResetPassword}
            >
              <h2 className="text-xl text-white mb-2 font-light">
                Secure Account
              </h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Choose a strong password that you haven't used before.
              </p>

              <InputField
                label="New Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />

              <InputField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="••••••••"
              />

              {error && (
                <p className="text-red-500 text-xs mb-4">{error}</p>
              )}

              <PrimaryButton label="Reset Password" />
            </motion.form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'SUCCESS' && (
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
                Success
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Your password has been updated. You can now log in to your
                account.
              </p>

              <button
                onClick={() => navigate('/login')}
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

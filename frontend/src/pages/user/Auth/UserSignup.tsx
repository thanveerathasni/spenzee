



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../public/Landing";
import { signupSchema } from "../../../validation/signupSchema";
import { authApi } from "../../../api/auth.api";
// import { GoogleLogin } from "@react-oauth/google";
import { api } from "../../../api/axios";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { ALERT_MESSAGES } from "../../../constants/messages";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate();

  const [showOtpField, setShowOtpField] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");
  //   if (token) {
  //     navigate("/welcome", { replace: true });
  //   }
  // }, [navigate]);



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

  const runZodValidation = () => {
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Errors = {};
      (Object.keys(fieldErrors) as (keyof Errors)[]).forEach((key) => {
        newErrors[key] = fieldErrors[key]?.[0];
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!showOtpField) return;
    if (otpTimer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setOtpTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer, showOtpField]);

  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    try {
      await authApi.resendOtp(formData.email);
      toast.success(`${ALERT_MESSAGES.AUTH.OTP_RESEND_SUCCESS} to ${formData.email}`);
      setOtpTimer(60);
      setCanResend(false);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || ALERT_MESSAGES.AUTH.OTP_RESEND_FAILED);
      } else {
        toast.error(ALERT_MESSAGES.AUTH.OTP_RESEND_FAILED);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!showOtpField) {
      if (!runZodValidation()) {
        setLoading(false);
        return;
      }
      try {
        await authApi.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "user",
        });
        toast.success(ALERT_MESSAGES.AUTH.OTP_SENT);
        setShowOtpField(true);
        setOtpTimer(60);
        setCanResend(false);
        setErrors({});
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          toast.error(err.response?.data?.message || ALERT_MESSAGES.AUTH.SIGNUP_FAILED);
        } else {
          toast.error(ALERT_MESSAGES.AUTH.SIGNUP_FAILED);
        }
      } finally {
        setLoading(false);
      }
    } else {
      if (!runZodValidation()) {
        setLoading(false);
        return;
      }
      try {
        await authApi.verifyOtp({
          email: formData.email,
          otp: formData.otp,
        });
        toast.success(ALERT_MESSAGES.AUTH.OTP_VERIFICATION_SUCCESS);
        navigate("/login", { replace: true });
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          toast.error(err.response?.data?.message || ALERT_MESSAGES.AUTH.OTP_VERIFICATION_FAILED);
        } else {
          toast.error(ALERT_MESSAGES.AUTH.OTP_VERIFICATION_FAILED);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center pt-28 px-6">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-10 tracking-tighter">
          Spenzee
        </h1>

        <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <header className="mb-8 text-center">
            <h1 className="text-xl text-white font-light">
              Create Account
            </h1>
            <p className="text-xs text-gray-500 tracking-widest uppercase mt-2">
              Join Spenzee
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-lg font-bold text-sm bg-white text-black"
              >
                User
              </button>
              <button
                type="button"
                onClick={() => navigate("/provider/request")}
                className="px-6 py-2 rounded-lg font-bold text-sm bg-white/10 text-black hover:text-white transition"
              >
                Provider
              </button>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* <GoogleLogin
              onSuccess={async (cred) => {
                try {
                  const res = await api.post("/auth/google", {
                    credential: cred.credential,
                  });
                  localStorage.setItem("accessToken", res.data.accessToken);
                  toast.success(ALERT_MESSAGES.AUTH.GOOGLE_SIGNUP_SUCCESS);
                  navigate("/welcome", { replace: true });
                } catch {
                  toast.error(ALERT_MESSAGES.AUTH.GOOGLE_SIGNUP_FAILED);
                }
              }}
              onError={() => toast.error(ALERT_MESSAGES.AUTH.GOOGLE_SIGNUP_FAILED)}
            /> */}

            {/* Name */}
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
               autoComplete="name"
              className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

            {/* Email */}
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
               autoComplete="email"
              className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                 autoComplete="new-password"
                className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}

            {/* OTP */}
            {showOtpField && (
              <div>
                <input
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
                />
                {errors.otp && <p className="text-xs text-red-500">{errors.otp}</p>}

                {!canResend ? (
                  <p className="text-xs text-gray-500 mt-2">
                    Resend in {otpTimer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-xs text-gray-400 hover:text-white transition mt-2"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-medium tracking-wide hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : showOtpField ? "Verify OTP" : "Sign Up"}
            </button>
          </form>
        </div>
         <div className="mt-12 text-gray-700 text-[10px] tracking-[0.2em] uppercase">
        &copy; {new Date().getFullYear()} Spenzee Studios
      </div>
      </div>
    </>
  );
};

export default SignupForm;

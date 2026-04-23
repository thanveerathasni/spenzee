import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/auth/auth.slice";
import { Navbar } from "../../public/Landing";

export default function ProviderLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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
      const res = await api.post("/provider/auth/login", { email, password });
      const { accessToken, provider } = res.data.data;
      dispatch(setAuth({ accessToken, user: { ...provider, role: "provider" } }));
      toast.success("Login success");
      if (provider.hasAcceptedTerms) {
        navigate("/provider/dashboard");
      } else {
        navigate("/provider/welcome");
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
      <div className="min-h-screen flex flex-col items-center pt-28 px-6">
        <h1 className="text-4xl text-black md:text-5xl font-serif mb-10 tracking-tighter">
          Spenzee
        </h1>

      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <header className="mb-8 text-center">
          <h1 className="text-xl text-white font-light">Sign In</h1>
          <p className="text-xs text-gray-700 tracking-widest uppercase mt-2">
            Provider Portal
          </p>

          {/* User / Provider switch */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-lg font-bold text-sm bg-white/10 text-black hover:text-white transition"
            >
              User
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-lg font-bold text-sm bg-white text-black"
            >
              Provider
            </button>
          </div>
        </header>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="Email"
              className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-2">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: undefined }));
              }}
              placeholder="Password"
              className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
                  <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500 mt-2">{errors.password}</p>
            )}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => navigate("/provider/forgot-password")}
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
          Not a provider?
          <button
            onClick={() => navigate("/login")}
            className="ml-2 text-white hover:underline"
          >
            User Login
          </button>
        </footer>
      </div>

      <div className="mt-12 text-gray-700 text-[10px] tracking-[0.2em] uppercase">
        &copy; {new Date().getFullYear()} Spenzee Studios
      </div>
    </div>
      </>
  );

}
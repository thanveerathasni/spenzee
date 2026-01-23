


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../public/Landing';
import { loginApi } from "../../../api/authApi";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../../api/axios";
interface Errors {
  email?: string;
  password?: string;
  otp?: string;
  confirmPassword?: string;
}

type LoginView = 'login' | 'forgot' | 'reset';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<LoginView>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/welcome", { replace: true });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateLogin = () => {
    const newErrors: Errors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (view === "login") {
      if (!validateLogin()) return;

      try {
        // ✅ loginApi already returns DATA
        const data = await loginApi({
          email: formData.email,
          password: formData.password,
        });

        // ✅ use data directly
        localStorage.setItem("accessToken", data.accessToken);

        const role = data.user.role;
        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "provider") navigate("/provider", { replace: true });
        else navigate("/welcome", { replace: true });

      } catch (err: any) {
        console.error("LOGIN ERROR:", err);
        alert(err?.message || "Login failed");
      }
    }
  };


  return (
    <>
      <Navbar />
      <div className="mt-20 max-w-md mx-auto px-6">
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter italic leading-none">
              {view === 'login' ? 'Sign In' : view === 'forgot' ? 'Identify' : 'Renew'}
            </h1>
            <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mt-3">
              {view === 'login' ? 'Access your account' : view === 'forgot' ? 'Account recovery' : 'Set new password'}
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <button
                type="button"
                className={`px-6 py-2 rounded-lg font-bold text-sm transition bg-black text-white dark:bg-white dark:text-black`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => navigate('/provider/login')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400`}
              >
                Provider
              </button>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'login' && (
              <GoogleLogin
                onSuccess={async (cred) => {
                  try {
                    const res = await api.post("/auth/google", {
                      credential: cred.credential,
                    });

                    localStorage.setItem("accessToken", res.data.accessToken);
                    navigate("/welcome", { replace: true });
                  } catch {
                    alert("Google login failed");
                  }
                }}
                onError={() => alert("Google login failed")}
              />
            )}

            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  disabled={view === 'reset'}
                  className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition disabled:opacity-50 placeholder-neutral-400 font-medium"
                />
                {errors.email && <p className="mt-2 ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.email}</p>}
              </div>

              {view === 'login' && (
                <div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition placeholder-neutral-400 font-medium"
                  />
                  {errors.password && <p className="mt-2 ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.password}</p>}
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-[9px] font-black uppercase text-neutral-400 hover:text-black dark:hover:text-white transition tracking-widest"
                    >
                      Forgot Password?
                    </button>

                  </div>
                </div>
              )}

              {view === 'reset' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition placeholder-neutral-300 font-mono text-center tracking-[0.5em] text-xl"
                    />
                    {errors.otp && <p className="mt-1 text-[9px] font-black text-red-500 uppercase text-center">{errors.otp}</p>}
                  </div>

                  <div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="New Password"
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition placeholder-neutral-400 font-medium"
                    />
                    {errors.password && <p className="mt-2 ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.password}</p>}
                  </div>

                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition placeholder-neutral-400 font-medium"
                    />
                    {errors.confirmPassword && <p className="mt-2 ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.confirmPassword}</p>}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4.5 mt-4 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white rounded-xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-neutral-300 dark:hover:bg-neutral-700 active:scale-[0.99] transition shadow-sm"
            >
              {view === 'login' ? 'Sign In' : view === 'forgot' ? 'Send Code' : 'Update Password'}
            </button>

            {view !== 'login' && (
              <div className="text-center mt-4">
                <button type="button" onClick={() => { setView('login'); setErrors({}); }} className="text-[9px] font-black uppercase text-neutral-400 hover:text-black dark:hover:text-white transition tracking-[0.2em]">
                  Back to Sign In
                </button>
              </div>
            )}
          </form>

          <footer className="mt-10 text-center pt-8 border-t border-neutral-50 dark:border-neutral-800">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest">
              No account?
              <button onClick={() => navigate('/signup')} className="ml-3 text-black dark:text-white hover:underline underline-offset-4 decoration-2">Create One</button>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

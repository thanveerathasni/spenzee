


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../public/Landing';
import { loginApi } from "../../../api/authApi";

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
              <>
                <button
                  type="button"
                  onClick={() => alert('Google auth active')}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.97-2.91 3.41-4.91 6.16-4.91z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-neutral-100 dark:border-neutral-800" />
                  <span className="mx-4 text-[9px] text-neutral-300 uppercase tracking-[0.3em] font-black italic">OR</span>
                  <div className="flex-grow border-t border-neutral-100 dark:border-neutral-800" />
                </div>
              </>
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
                    <button type="button" onClick={() => { setView('forgot'); setErrors({}); }} className="text-[9px] font-black uppercase text-neutral-400 hover:text-black dark:hover:text-white transition tracking-widest">
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

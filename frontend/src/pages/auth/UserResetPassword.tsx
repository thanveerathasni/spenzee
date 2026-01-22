
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = { password: '', confirmPassword: '' };
    let valid = true;

    if (!formData.password) {
      newErrors.password = 'A new password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'At least 8 characters are required';
      valid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Requires upper, lower, number, and symbol';
      valid = false;
    }

    if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'The passwords do not match';
      valid = false;
    } else if (!formData.confirmPassword && formData.password) {
      valid = false;
    }

    setErrors(newErrors);
    setIsValid(valid && formData.confirmPassword !== '');
  };

  useEffect(() => {
    validate();
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F5F3] p-4 sm:p-8">
      <div className="w-full max-w-[450px] bg-[#111111] px-8 py-12 sm:px-12 sm:py-16 rounded-sm shadow-2xl border border-white/5">
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-white mb-3 tracking-tighter">Spenzee</h1>
          <h2 className="font-serif text-xl text-white/90 font-light italic">Reset your password</h2>
          <p className="text-gray-500 text-[13px] mt-3 font-light leading-relaxed">Choose a strong, secure password to protect your account.</p>
        </div>

        {success ? (
          <div className="text-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-14 h-14 bg-emerald-400/10 border border-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-sm mb-10 tracking-wide font-light">Your password has been updated successfully.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-white text-[#111111] py-5 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-gray-200 transition-all"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-1.5">
              <label className="text-gray-500 text-[9px] uppercase tracking-[0.25em] font-semibold">New Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-transparent border-b border-white/10 text-white pb-2 text-[15px] font-light luxury-input"
                placeholder="••••••••"
                aria-required="true"
                autoFocus
              />
              {errors.password && <p className="text-red-400 text-[10px] mt-1.5 font-light">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 text-[9px] uppercase tracking-[0.25em] font-semibold">Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-transparent border-b border-white/10 text-white pb-2 text-[15px] font-light luxury-input"
                placeholder="••••••••"
                aria-required="true"
              />
              {errors.confirmPassword && <p className="text-red-400 text-[10px] mt-1.5 font-light">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full bg-white text-[#111111] py-5 mt-8 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;

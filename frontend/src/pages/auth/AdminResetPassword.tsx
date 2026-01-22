import React, { useState } from 'react';
import { ShieldAlert, Lock, Eye, EyeOff } from 'lucide-react';

/* =======================
   BUTTON
======================= */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, isLoading, ...props }) => {
  return (
    <button
      {...props}
      className="
        w-full py-4 px-6 
        bg-[#FFFFFF] text-[#111111] 
        text-[11px] uppercase tracking-[0.25em] font-bold
        hover:bg-[#EBEBEB] 
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 
        flex items-center justify-center gap-2
      "
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-[#111111]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing
        </span>
      ) : (
        children
      )}
    </button>
  );
};

/* =======================
   CARD
======================= */
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-[440px] bg-[#111111] shadow-2xl p-8 md:p-12 border border-[#222222]">
    {children}
  </div>
);

/* =======================
   INPUT
======================= */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] uppercase tracking-[0.15em] text-[#666666] font-semibold">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-[#1A1A1A] border border-[#333333] text-white px-4 py-3 text-sm tracking-wide placeholder-[#444444] focus:outline-none focus:border-[#666666] transition-all"
    />
  </div>
);

/* =======================
   MAIN PAGE
======================= */
const App: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Password updated successfully. Redirecting...' });
    }, 1500);
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#F6F5F3]">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl tracking-tight text-[#111111]">Spenzee</h1>
        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#666666] font-medium">
          Admin Credentials Management
        </p>
      </header>

      {/* Card */}
      <Card>
        <div className="space-y-6">
          <div className="border-b border-[#333333] pb-6">
            <h2 className="text-xl text-white mb-2">Reset Admin Password</h2>
            <p className="text-sm text-[#999999]">
              Create a new secure password for your administrator account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-[#666666] hover:text-[#999999]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <div className="flex items-start gap-2 pt-1">
                <Lock size={12} className="text-[#666666] mt-0.5" />
                <p className="text-[11px] text-[#666666]">
                  Minimum 8 characters. Use numbers and symbols.
                </p>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 text-xs ${
                  message.type === 'error'
                    ? 'bg-[#1A1111] border border-[#3D1A1A] text-[#FF5F5F]'
                    : 'bg-[#111A11] border border-[#1A3D1A] text-[#5FFF5F]'
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
              Update Password
            </Button>
          </form>
        </div>
      </Card>

      {/* Footer */}
      <footer className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-[#666666]">
          <ShieldAlert size={14} />
          <p className="text-[10px] uppercase tracking-widest">
            Unauthorized access attempts are monitored.
          </p>
        </div>
        <div className="h-px w-12 bg-[#D1D0CE]" />
      </footer>
    </main>
  );
};

export default App;

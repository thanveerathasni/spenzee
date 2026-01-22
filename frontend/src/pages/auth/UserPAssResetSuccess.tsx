import React from 'react';

/* =======================
   LOCK ICON
======================= */
const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* =======================
   LAYOUT
======================= */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="h-full w-full flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-700">
    <div className="w-full max-w-md bg-near-black text-white p-10 md:p-16 rounded-[4px] shadow-2xl flex flex-col items-center text-center">
      {children}
    </div>
  </main>
);

/* =======================
   PASSWORD RESET SUCCESS
======================= */
const PasswordResetSuccess: React.FC<{ onAction?: () => void }> = ({ onAction }) => {
  const handleAction = () => {
    if (onAction) onAction();
    else alert('Redirect to login');
  };

  return (
    <Layout>
      <div className="mb-12">
        <span className="font-serif text-3xl tracking-tight block mb-2">Spenzee</span>
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-50">
          Security Update
        </span>
      </div>

      <div className="w-12 h-12 flex items-center justify-center mb-8">
        <LockIcon className="w-6 h-6 text-white/70" />
      </div>

      <h1 className="font-serif text-2xl md:text-3xl font-normal mb-6 leading-tight">
        Password updated
      </h1>

      <p className="text-white/60 text-sm font-light leading-relaxed mb-12 max-w-[300px]">
        Your password has been changed successfully. You can now sign in with your new credentials.
      </p>

      <button
        onClick={handleAction}
        className="w-full bg-white text-near-black py-4 px-8 text-xs uppercase tracking-widest font-medium rounded-[2px] transition-all hover:bg-white/90 active:scale-[0.98]"
      >
        Return to Login
      </button>

      <p className="mt-8 text-[10px] text-white/30 font-light max-w-[220px]">
        If this wasn’t you, please contact support immediately.
      </p>
    </Layout>
  );
};

export default PasswordResetSuccess;

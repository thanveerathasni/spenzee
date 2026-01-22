import React from 'react';

/* =======================
   ICON
======================= */
const LogOutIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
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
   LOGOUT CONFIRMATION PAGE
======================= */
const LogoutConfirmation: React.FC<{ onAction?: () => void }> = ({ onAction }) => {
  const handleAction = () => {
    if (onAction) onAction();
    else alert('Redirect to login page');
  };

  return (
    <Layout>
      <div className="mb-12">
        <span className="font-serif text-3xl tracking-tight block mb-8">Spenzee</span>
      </div>

      <div className="w-12 h-12 flex items-center justify-center mb-8">
        <LogOutIcon className="w-6 h-6 text-white/40" />
      </div>

      <h1 className="font-serif text-2xl md:text-3xl font-normal mb-6 leading-tight">
        You’ve been signed out
      </h1>

      <p className="text-white/60 text-sm font-light leading-relaxed mb-12 max-w-[280px]">
        Your session has ended safely.
      </p>

      <button
        onClick={handleAction}
        className="w-full bg-white text-near-black py-4 px-8 text-xs uppercase tracking-widest font-medium rounded-[2px] transition-all hover:bg-white/90 active:scale-[0.98]"
      >
        Sign in again
      </button>

      <p className="mt-8 text-[11px] italic font-serif text-white/30">
        We’ll be here when you’re ready.
      </p>
    </Layout>
  );
};

export default LogoutConfirmation;

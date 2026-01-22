import React from 'react';

/* =======================
   ICON
======================= */
interface IconProps {
  className?: string;
}

const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* =======================
   SUCCESS VIEW
======================= */
const SuccessView: React.FC = () => {
  const handleLoginRedirect = () => {
    console.log('Redirecting to admin login...');
    alert('Navigation to Admin Login initiated.');
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="text-center mb-12 space-y-1">
        <h1 className="text-[#111111] text-xs font-semibold uppercase tracking-[0.25em]">
          Spenzee
        </h1>
        <p className="text-[#111111]/60 text-[10px] uppercase tracking-widest font-medium">
          Admin Credentials
        </p>
      </div>

      <div className="bg-[#111111] w-full p-10 md:p-14 shadow-2xl flex flex-col items-center text-center">
        <div className="mb-8 text-[#F6F5F3]">
          <CheckCircleIcon className="w-12 h-12 stroke-[1px]" />
        </div>

        <div className="space-y-4 mb-10">
          <h2 className="text-[#F6F5F3] text-2xl font-normal tracking-tight">
            Password Updated
          </h2>
          <p className="text-[#F6F5F3]/70 text-sm leading-relaxed max-w-[280px] mx-auto">
            Your administrator password has been successfully updated.
          </p>
        </div>

        <button
          onClick={handleLoginRedirect}
          className="w-full bg-[#F6F5F3] text-[#111111] py-4 px-6 text-sm font-medium transition-colors hover:bg-[#F6F5F3]/90 active:scale-[0.99] focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-[#111111]"
        >
          Continue to Admin Login
        </button>
      </div>

      <div className="mt-12 max-w-xs text-center">
        <p className="text-[#111111]/50 text-xs leading-relaxed">
          If this was not you, contact system security immediately.
        </p>
      </div>
    </div>
  );
};

/* =======================
   APP
======================= */
const App: React.FC = () => {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <SuccessView />
    </main>
  );
};

export default App;

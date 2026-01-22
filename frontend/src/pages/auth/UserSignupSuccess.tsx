
import React from 'react';

interface SuccessPageProps {
  onNavigate: (view: any) => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-[#F6F5F3]">
      <div className="w-full max-w-sm bg-[#111111] rounded-2xl shadow-2xl p-8 md:p-12 text-white border border-white/5 text-center">
        <div className="mb-8">
          <h1 className="font-serif text-3xl italic mb-6 tracking-tight">Spenzee</h1>
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
              <path d="M20 6L9 17L4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-3">Password updated</h2>
          <p className="text-white/50 text-sm font-light leading-relaxed">
            Your password has been changed successfully. You can now sign in with your new password.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('login')}
          className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-white/90 active:scale-[0.98] transition-all text-sm uppercase tracking-widest"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;

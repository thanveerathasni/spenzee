
import React from 'react';

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 md:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;

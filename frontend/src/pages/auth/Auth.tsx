
import React, { useState } from 'react';
import LoginForm from '../user/Auth/UserLogin'
import SignupForm from '../user/Auth/UserSignup';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 transition-colors duration-500 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-8 transition-all">
        {isLogin ? (
          <LoginForm onToggle={toggleMode} />
        ) : (
          <SignupForm onToggle={toggleMode} />
        )}
      </div>
    </div>
  );
}

export default AuthPage;

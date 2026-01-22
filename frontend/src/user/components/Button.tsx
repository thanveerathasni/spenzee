
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'social' | 'text';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "w-full py-3.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-stone-800 text-stone-50 hover:bg-stone-700 shadow-sm",
    social: "bg-white border border-stone-100 text-stone-700 hover:bg-stone-50",
    text: "bg-transparent text-stone-500 hover:text-stone-800 py-2"
  };

  return (
    <button 
      {...props} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};

export default Button;

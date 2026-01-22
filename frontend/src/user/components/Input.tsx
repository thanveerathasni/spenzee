
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-sm font-medium text-stone-500">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-xl bg-stone-50 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-200 transition-all ${
          error ? 'ring-1 ring-rose-200' : ''
        }`}
      />
      {error && (
        <p className="text-xs text-rose-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;

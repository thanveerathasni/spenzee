import type { ButtonHTMLAttributes, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-[#111111] border border-white/10 rounded-2xl p-8 shadow-2xl ${className}`}>
    {children}
  </div>
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, className = "", type = "submit", ...props }: ButtonProps) => (
  <button
    type={type}
    className={`w-full bg-white text-[#111111] py-4 rounded-xl text-xs font-bold uppercase tracking-[0.24em] transition hover:bg-gray-200 disabled:opacity-60 ${className}`}
    {...props}
  >
    {children}
  </button>
);

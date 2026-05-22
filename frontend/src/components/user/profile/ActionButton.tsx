

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}

export default function ActionButton({ children, onClick, variant = "primary" }: ActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
        ${variant === "primary"
          ? "bg-white text-black hover:bg-white/90"
          : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
        }`}
    >
      {children}
    </motion.button>
  );
}
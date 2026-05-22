



import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ProfileCardProps {
  children: ReactNode;
  className?: string;
}

export default function ProfileCard({ children, className = "" }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}
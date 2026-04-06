import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ProfileCardProps {
  children: ReactNode;
}

export default function ProfileCard({ children }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200"
    >
      {children}
    </motion.div>
  );
}
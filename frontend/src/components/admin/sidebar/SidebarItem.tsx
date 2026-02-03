import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isExpanded: boolean;
  danger?: boolean;
  onClick?: () => void;
}


const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  isExpanded,
  danger,
  onClick,
}) => {
  return (
 <motion.div
  onClick={onClick}
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
  className={`
    flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
    ${
      isActive
        ? "bg-gray-900 text-white shadow-md shadow-gray-200"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    }
    ${danger ? "hover:bg-red-50 hover:text-red-600" : ""}
  `}
>

      <div className="shrink-0">{icon}</div>

      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            className="text-sm font-medium whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SidebarItem;

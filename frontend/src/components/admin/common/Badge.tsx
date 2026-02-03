
import React from "react";
import { SEVERITY } from "../../../types/admin/dashboard.types";
import type { Severity } from "../../../types/admin/dashboard.types";

interface BadgeProps {
  type: Severity | "success" | "pending" | "failed";
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ type, children }) => {
  const getStyles = () => {
    switch (type) {
      case SEVERITY.CRITICAL:
        return "bg-red-50 text-red-700 border-red-100";
      case SEVERITY.HIGH:
        return "bg-orange-50 text-orange-700 border-orange-100";
      case SEVERITY.MEDIUM:
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "success":
        return "bg-green-50 text-green-700 border-green-100";
      case "failed":
        return "bg-red-50 text-red-700 border-red-100";
      case "pending":
        return "bg-gray-50 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStyles()}`}>
      {children}
    </span>
  );
};

export default Badge;

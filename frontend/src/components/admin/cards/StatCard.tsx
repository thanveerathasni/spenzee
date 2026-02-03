import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend: number;
  trendDirection: "up" | "down";
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendDirection,
  description,
}) => {
  const isUp = trendDirection === "up";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{
        y: -4,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
      }}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {label}
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </h3>
        </div>

        <div
          className={`px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold ${
            isUp
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {isUp ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {trend}%
        </div>
      </div>

      <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isUp ? "85%" : "45%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full ${
            isUp ? "bg-gray-900" : "bg-gray-400"
          }`}
        />
      </div>

      <p className="text-xs text-gray-400 font-normal">
        {description}
      </p>
    </motion.div>
  );
};

export default StatCard;

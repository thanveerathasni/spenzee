import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatusItem {
  name: string;
  value: number;
  color: string;
}

interface StatusDonutProps {
  data: StatusItem[];
  totalLabel?: string;
}

const StatusDonut: React.FC<StatusDonutProps> = ({
  data,
  totalLabel = "Total",
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-[240px] w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationBegin={200}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-gray-900">
          {total}
        </span>
        <span className="text-xs text-gray-400">{totalLabel}</span>
      </div>
    </div>
  );
};

export default StatusDonut;

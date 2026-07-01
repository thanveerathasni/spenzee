import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  FinancialInsight,
} from "../../types/financial";

interface SpendingChartsProps {
  analytics: FinancialInsight | null;
}

const colors = [
  "#111111",
  "#525252",
  "#737373",
  "#a3a3a3",
  "#d4d4d4",
];

export default function SpendingCharts({
  analytics,
}: SpendingChartsProps) {
  const monthly =
    analytics?.monthlySummaries ?? [];
  const categories =
    analytics?.categorySummaries ?? [];

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm xl:col-span-2">
        <h2 className="text-lg font-black tracking-tight text-black">
          Monthly Trend
        </h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <AreaChart data={monthly}>
              <CartesianGrid
                stroke="#f1f1f1"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#111111"
                fill="#111111"
                fillOpacity={0.12}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#737373"
                fill="#737373"
                fillOpacity={0.12}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black tracking-tight text-black">
          Category Mix
        </h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={categories}
                dataKey="amount"
                nameKey="category"
                outerRadius={92}
              >
                {categories.map(
                  (category, index) => (
                    <Cell
                      key={category.category}
                      fill={
                        colors[
                          index %
                            colors.length
                        ]
                      }
                    />
                  ),
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm xl:col-span-3">
        <h2 className="text-lg font-black tracking-tight text-black">
          Income vs Expense
        </h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <CartesianGrid
                stroke="#f1f1f1"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar
                dataKey="income"
                fill="#111111"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="expense"
                fill="#a3a3a3"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

import type {
  FinancialInsight,
} from "../../types/financial";
import {
  formatCurrency,
} from "./format";

interface SpendingCategoryBreakdownProps {
  analytics: FinancialInsight | null;
}

export default function SpendingCategoryBreakdown({
  analytics,
}: SpendingCategoryBreakdownProps) {
  const categories =
    analytics?.categorySummaries ?? [];

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black tracking-tight text-black">
        Spending Categories
      </h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.category}
            className="rounded-2xl border border-black/[0.06] bg-black/[0.02] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-black">
                {category.category}
              </p>
              <span className="text-[10px] font-black text-black/45">
                {category.percentage}%
              </span>
            </div>
            <p className="mt-3 text-lg font-black text-black">
              {formatCurrency(
                category.amount,
              )}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-black"
                style={{
                  width: `${Math.min(
                    100,
                    category.percentage,
                  )}%`,
                }}
              />
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-black/35">
              {category.trend > 0
                ? `+${category.trend}%`
                : `${category.trend}%`}{" "}
              trend
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

import {
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import type {
  FinancialInsight,
  InsightSeverity,
} from "../../types/financial";

interface SmartInsightsPanelProps {
  analytics: FinancialInsight | null;
}

const severityClass: Record<
  InsightSeverity,
  string
> = {
  positive:
    "border-emerald-100 bg-emerald-50 text-emerald-700",
  info:
    "border-zinc-100 bg-zinc-50 text-zinc-700",
  warning:
    "border-amber-100 bg-amber-50 text-amber-700",
  critical:
    "border-red-100 bg-red-50 text-red-700",
};

export default function SmartInsightsPanel({
  analytics,
}: SmartInsightsPanelProps) {
  const insights =
    analytics?.smartInsights ?? [];

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black tracking-tight text-black">
        Smart Insights
      </h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {insights.map((insight) => {
          const Icon =
            insight.severity === "positive"
              ? CheckCircle2
              : insight.severity === "info"
                ? Info
                : AlertTriangle;

          return (
            <div
              key={insight.title}
              className={`rounded-2xl border p-4 ${severityClass[insight.severity]}`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  size={18}
                  className="mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-sm font-black">
                    {insight.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 opacity-75">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

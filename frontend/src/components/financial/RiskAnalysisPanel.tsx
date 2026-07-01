import type {
  FinancialInsight,
  InsightSeverity,
} from "../../types/financial";

interface RiskAnalysisPanelProps {
  analytics: FinancialInsight | null;
}

const riskClass: Record<
  InsightSeverity,
  string
> = {
  positive: "bg-emerald-500",
  info: "bg-zinc-400",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

export default function RiskAnalysisPanel({
  analytics,
}: RiskAnalysisPanelProps) {
  const indicators =
    analytics?.riskIndicators ?? [];

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-black tracking-tight text-black">
            Risk Indicators
          </h2>
          <p className="mt-1 text-xs font-bold text-black/40">
            Risk score {analytics?.riskScore ?? 0}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-black">
            {analytics?.financialHealthScore ?? 0}
          </p>
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-black/30">
            Health
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {indicators.map((indicator) => (
          <div
            key={indicator.key}
            className="rounded-2xl border border-black/[0.06] p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-black">
                {indicator.label}
              </p>
              <span
                className={`h-2.5 w-2.5 rounded-full ${riskClass[indicator.severity]}`}
              />
            </div>
            <p className="mt-3 text-2xl font-black text-black">
              {indicator.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

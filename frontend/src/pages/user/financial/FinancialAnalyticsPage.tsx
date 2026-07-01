import {
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { bankStatementApi } from "../../../api/bankStatement.api";
import AnalyticsCards from "../../../components/financial/AnalyticsCards";
import RiskAnalysisPanel from "../../../components/financial/RiskAnalysisPanel";
import SmartInsightsPanel from "../../../components/financial/SmartInsightsPanel";
import SpendingCategoryBreakdown from "../../../components/financial/SpendingCategoryBreakdown";
import SpendingCharts from "../../../components/financial/SpendingCharts";
import TransactionExplorer from "../../../components/financial/TransactionExplorer";
import type {
  FinancialInsight,
} from "../../../types/financial";

export default function FinancialAnalyticsPage() {
  const [analytics, setAnalytics] =
    useState<FinancialInsight | null>(
      null,
    );
  const [loading, setLoading] =
    useState(true);

  const load = useCallback(
    async () => {
      try {
        setAnalytics(
          await bankStatementApi.getAnalytics(),
        );
      } catch {
        toast.error(
          "Unable to load analytics",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/35">
          Analytics
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-black md:text-5xl">
          Spending Intelligence
        </h1>
      </header>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-5">
          {[0, 1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-black/5"
              />
            ),
          )}
        </div>
      ) : (
        <>
          <AnalyticsCards
            analytics={analytics}
          />
          <SpendingCharts
            analytics={analytics}
          />
          <SmartInsightsPanel
            analytics={analytics}
          />
          <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <SpendingCategoryBreakdown
              analytics={analytics}
            />
            <RiskAnalysisPanel
              analytics={analytics}
            />
          </div>
          <TransactionExplorer />
        </>
      )}
    </div>
  );
}

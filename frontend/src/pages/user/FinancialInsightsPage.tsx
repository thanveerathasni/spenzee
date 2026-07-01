import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { bankStatementApi } from "../../api/bankStatement.api";
import AnalyticsCards from "../../components/financial/AnalyticsCards";
import RiskAnalysisPanel from "../../components/financial/RiskAnalysisPanel";
import SmartInsightsPanel from "../../components/financial/SmartInsightsPanel";
import SpendingCategoryBreakdown from "../../components/financial/SpendingCategoryBreakdown";
import SpendingCharts from "../../components/financial/SpendingCharts";
import StatementHistoryTable from "../../components/financial/StatementHistoryTable";
import StatementUploadPanel from "../../components/financial/StatementUploadPanel";
import TransactionExplorer from "../../components/financial/TransactionExplorer";
import type {
  BankStatement,
  FinancialInsight,
} from "../../types/financial";

export default function FinancialInsightsPage() {
  const [statements, setStatements] =
    useState<BankStatement[]>([]);
  const [analytics, setAnalytics] =
    useState<FinancialInsight | null>(
      null,
    );
  const [loading, setLoading] =
    useState(true);

  const load = useCallback(
    async () => {
      try {
        const [
          statementList,
          insight,
        ] = await Promise.all([
          bankStatementApi.getStatements(),
          bankStatementApi.getAnalytics(),
        ]);

        setStatements(statementList);
        setAnalytics(insight);
      } catch {
        toast.error(
          "Failed to load financial insights",
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

  const hasProcessing =
    statements.some(
      (statement) =>
        statement.status ===
          "processing" ||
        statement.status === "uploaded",
    );

  useEffect(() => {
    if (!hasProcessing) {
      return undefined;
    }

    const timer = window.setInterval(
      () => {
        void load();
      },
      5000,
    );

    return () =>
      window.clearInterval(timer);
  }, [hasProcessing, load]);

  return (
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-black md:text-5xl">
              Financial Insights
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-black/45">
              Upload at least 90 days of statements to unlock cash flow, spending intelligence, risk indicators, and transaction analytics.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </header>

        <StatementUploadPanel
          onUploaded={() => {
            void load();
          }}
        />

        {hasProcessing && (
          <motion.section
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800"
          >
            <p className="text-sm font-black">
              Analysis in progress
            </p>
            <p className="mt-1 text-xs font-medium opacity-75">
              We are validating coverage, parsing transactions, categorizing merchants, and generating insights.
            </p>
          </motion.section>
        )}

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
            <StatementHistoryTable
              statements={statements}
              onDeleted={() => {
                void load();
              }}
            />
            <TransactionExplorer />
          </>
        )}
      </div>
  );
}

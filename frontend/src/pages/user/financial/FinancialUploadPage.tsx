import {
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { bankStatementApi } from "../../../api/bankStatement.api";
import AnalyticsCards from "../../../components/financial/AnalyticsCards";
import SmartInsightsPanel from "../../../components/financial/SmartInsightsPanel";
import StatementHistoryTable from "../../../components/financial/StatementHistoryTable";
import StatementUploadPanel from "../../../components/financial/StatementUploadPanel";
import type {
  BankStatement,
  FinancialInsight,
} from "../../../types/financial";

export default function FinancialUploadPage() {
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
          "Unable to load statement status",
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
          "uploaded" ||
        statement.status === "processing",
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
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/35">
          Upload Statements
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-black md:text-5xl">
          Statement Analysis
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-black/45">
          Upload PDF, CSV, or Excel statements. Spenzee validates coverage, rejects duplicate or unreadable files, and starts processing automatically.
        </p>
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
            Analyzing Statement...
          </p>
          <p className="mt-1 text-xs font-medium opacity-75">
            Parsing transactions, detecting date coverage, categorizing merchants, and building insights.
          </p>
        </motion.section>
      )}

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-black/5" />
      ) : (
        <>
          <AnalyticsCards
            analytics={analytics}
          />
          <SmartInsightsPanel
            analytics={analytics}
          />
          <StatementHistoryTable
            statements={statements}
            onDeleted={() => {
              void load();
            }}
          />
        </>
      )}
    </div>
  );
}

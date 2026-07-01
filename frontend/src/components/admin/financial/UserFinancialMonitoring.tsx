import {
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { adminFinancialApi } from "../../../api/bankStatement.api";
import AnalyticsCards from "../../financial/AnalyticsCards";
import RiskAnalysisPanel from "../../financial/RiskAnalysisPanel";
import SpendingCategoryBreakdown from "../../financial/SpendingCategoryBreakdown";
import StatementHistoryTable from "../../financial/StatementHistoryTable";
import type {
  AdminFinancialAction,
  BankStatement,
  FinancialInsight,
} from "../../../types/financial";

interface UserFinancialMonitoringProps {
  userId: string;
}

const actions: Array<{
  label: string;
  action: AdminFinancialAction;
}> = [
  {
    label: "Mark suspicious",
    action: "mark_suspicious",
  },
  {
    label: "Freeze analytics",
    action: "freeze_analytics",
  },
  {
    label: "Request reupload",
    action: "request_reupload",
  },
  {
    label: "Reject",
    action: "reject_statement",
  },
];

export default function UserFinancialMonitoring({
  userId,
}: UserFinancialMonitoringProps) {
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
          adminFinancialApi.getStatements(
            userId,
          ),
          adminFinancialApi.getAnalytics(
            userId,
          ),
        ]);

        setStatements(statementList);
        setAnalytics(insight);
      } catch {
        toast.error(
          "Failed to load financial monitoring",
        );
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (
    statementId: string,
    action: AdminFinancialAction,
  ) => {
    try {
      await adminFinancialApi.updateStatementStatus(
        userId,
        statementId,
        {
          action,
          rejectionReason:
            action === "reject_statement" ||
            action === "request_reupload"
              ? "Admin review action requested"
              : undefined,
        },
      );
      toast.success("Monitoring updated");
      void load();
    } catch {
      toast.error(
        "Failed to update monitoring status",
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/[0.06] bg-white p-6 text-xs font-black uppercase tracking-[0.3em] text-black/25">
        Loading financial monitoring...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <AnalyticsCards
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
      <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black tracking-tight text-black">
          Statement Review
        </h2>
        <div className="mt-4 space-y-3">
          {statements.map((statement) => (
            <div
              key={statement.id}
              className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="text-sm font-black text-black">
                  {statement.originalFileName}
                </p>
                <p className="mt-1 text-xs font-bold text-black/40">
                  {statement.bankName} · {statement.status} · {statement.coverageDays} days
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={statement.originalFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-black/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-black"
                >
                  Preview
                </a>
                {actions.map((item) => (
                  <button
                    key={item.action}
                    type="button"
                    onClick={() =>
                      void runAction(
                        statement.id,
                        item.action,
                      )
                    }
                    className="rounded-xl border border-black/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <StatementHistoryTable
        statements={statements}
      />
    </div>
  );
}

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { bankStatementApi } from "../../../api/bankStatement.api";
import StatementHistoryTable from "../../../components/financial/StatementHistoryTable";
import type {
  BankStatement,
} from "../../../types/financial";

export default function FinancialStatementsPage() {
  const [statements, setStatements] =
    useState<BankStatement[]>([]);
  const [loading, setLoading] =
    useState(true);

  const load = useCallback(
    async () => {
      try {
        setStatements(
          await bankStatementApi.getStatements(),
        );
      } catch {
        toast.error(
          "Unable to load statements",
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
          Statement History
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-black md:text-5xl">
          Uploaded Statements
        </h1>
      </header>
      {loading ? (
        <div className="h-80 animate-pulse rounded-2xl bg-black/5" />
      ) : (
        <StatementHistoryTable
          statements={statements}
          onDeleted={() => {
            void load();
          }}
        />
      )}
    </div>
  );
}

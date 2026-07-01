import {
  useMemo,
  useState,
} from "react";
import {
  Download,
  Eye,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { bankStatementApi } from "../../api/bankStatement.api";
import { ROUTES } from "../../constants/routes";
import type {
  BankStatement,
  BankStatementStatus,
} from "../../types/financial";
import StatusBadge from "./StatusBadge";
import { formatDate } from "./format";

interface StatementHistoryTableProps {
  statements: BankStatement[];
  onDeleted?: () => void;
}

export default function StatementHistoryTable({
  statements,
  onDeleted,
}: StatementHistoryTableProps) {
  const [search, setSearch] =
    useState("");
  const [status, setStatus] =
    useState<BankStatementStatus | "">("");
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("desc");

  const pageSize = 8;

  const filtered = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return statements
      .filter((statement) => {
        const matchesSearch =
          !normalizedSearch ||
          statement.originalFileName
            .toLowerCase()
            .includes(normalizedSearch) ||
          statement.bankName
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesStatus =
          !status ||
          statement.status === status;

        return (
          matchesSearch &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        const first =
          new Date(
            a.createdAt,
          ).getTime();
        const second =
          new Date(
            b.createdAt,
          ).getTime();

        return sortDirection === "desc"
          ? second - first
          : first - second;
      });
  }, [
    search,
    sortDirection,
    statements,
    status,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSize),
  );

  const visible = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const deleteStatement = async (
    statement: BankStatement,
  ) => {
    const result = await Swal.fire({
      title: "Delete statement?",
      text: "This removes the statement and its parsed transactions.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#111111",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await bankStatementApi.deleteStatement(
        statement.id,
      );
      toast.success("Statement deleted");
      onDeleted?.();
    } catch {
      toast.error(
        "Unable to delete statement",
      );
    }
  };

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-black tracking-tight text-black">
          Statement History
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2">
            <Search
              size={15}
              className="text-black/35"
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value,
                );
                setPage(1);
              }}
              placeholder="Search statements"
              className="w-full bg-transparent text-xs font-bold outline-none"
            />
          </label>
          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value as
                  | BankStatementStatus
                  | "",
              );
              setPage(1);
            }}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold outline-none"
          >
            <option value="">All statuses</option>
            <option value="uploaded">Uploaded</option>
            <option value="processing">Processing</option>
            <option value="analyzed">Analyzed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-black/[0.06] text-[9px] font-black uppercase tracking-[0.24em] text-black/30">
              <th className="py-3">File</th>
              <th>Bank</th>
              <th>Duration</th>
              <th>
                <button
                  type="button"
                  onClick={() =>
                    setSortDirection((value) =>
                      value === "desc"
                        ? "asc"
                        : "desc",
                    )
                  }
                >
                  Uploaded
                </button>
              </th>
              <th>Status</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05]">
            {visible.map((statement) => (
              <tr
                key={statement.id}
                className="text-xs text-black/65"
              >
                <td className="max-w-[220px] truncate py-4 font-bold text-black">
                  {statement.originalFileName}
                </td>
                <td>{statement.bankName}</td>
                <td>
                  {formatDate(
                    statement.periodStart,
                  )}{" "}
                  -{" "}
                  {formatDate(
                    statement.periodEnd,
                  )}
                </td>
                <td>
                  {formatDate(
                    statement.createdAt,
                  )}
                </td>
                <td>
                  <StatusBadge
                    status={statement.status}
                  />
                </td>
                <td className="max-w-[220px] truncate text-red-500">
                  {statement.rejectionReason ??
                    "—"}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <a
                      href={statement.originalFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-black/10 p-2 text-black/55 transition hover:bg-black hover:text-white"
                      title="Preview"
                    >
                      <Eye size={14} />
                    </a>
                    <a
                      href={statement.originalFileUrl}
                      download
                      className="rounded-lg border border-black/10 p-2 text-black/55 transition hover:bg-black hover:text-white"
                      title="Download"
                    >
                      <Download size={14} />
                    </a>
                    <Link
                      to={ROUTES.USER.FINANCIAL_INSIGHTS_UPLOAD}
                      className="rounded-lg border border-black/10 p-2 text-black/55 transition hover:bg-black hover:text-white"
                      title="Reupload"
                    >
                      <RefreshCw size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        void deleteStatement(
                          statement,
                        )
                      }
                      className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visible.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm font-bold text-black/35">
          No statements match your filters.
        </div>
      )}
      <div className="mt-4 flex items-center justify-between text-xs font-bold text-black/40">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage((value) =>
                Math.max(1, value - 1),
              )
            }
            className="rounded-lg border border-black/10 px-3 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() =>
              setPage((value) =>
                Math.min(
                  totalPages,
                  value + 1,
                ),
              )
            }
            className="rounded-lg border border-black/10 px-3 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

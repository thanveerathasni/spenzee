import type {
  BankStatementStatus,
} from "../../types/financial";

const statusClass: Record<
  BankStatementStatus,
  string
> = {
  uploaded:
    "border-zinc-200 bg-zinc-50 text-zinc-600",
  processing:
    "border-amber-200 bg-amber-50 text-amber-700",
  analyzed:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected:
    "border-red-200 bg-red-50 text-red-700",
};

interface StatusBadgeProps {
  status: BankStatementStatus;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${statusClass[status]}`}
    >
      {status}
    </span>
  );
}

import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { VerificationStatus } from "../../types/verification";

interface VerificationStatusBadgeProps {
  status?: VerificationStatus;
}

const styles: Record<VerificationStatus, string> = {
  pending: "bg-amber-400/10 text-amber-300",
  approved: "bg-emerald-400/10 text-emerald-300",
  rejected: "bg-red-400/10 text-red-300",
};

export default function VerificationStatusBadge({ status }: VerificationStatusBadgeProps) {
  if (!status) {
    return <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">Not submitted</span>;
  }

  const Icon = status === "approved" ? CheckCircle2 : status === "rejected" ? XCircle : Clock3;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${styles[status]}`}>
      <Icon size={14} />
      {status}
    </span>
  );
}

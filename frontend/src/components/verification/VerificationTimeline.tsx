import { VerificationStatus } from "../../types/verification";

interface VerificationTimelineProps {
  status?: VerificationStatus;
  submittedAt?: string;
  reviewedAt?: string;
}

export default function VerificationTimeline({
  status,
  submittedAt,
  reviewedAt,
}: VerificationTimelineProps) {
  const items = [
    { label: "Submitted", active: Boolean(submittedAt), value: submittedAt },
    { label: "In review", active: status === "pending" || status === "approved" || status === "rejected" },
    { label: status === "rejected" ? "Rejected" : "Approved", active: status === "approved" || status === "rejected", value: reviewedAt },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className={item.active ? "text-sm text-white" : "text-sm text-white/35"}>{item.label}</p>
          {item.value && <p className="mt-1 text-xs text-white/40">{new Date(item.value).toLocaleString()}</p>}
        </div>
      ))}
    </div>
  );
}

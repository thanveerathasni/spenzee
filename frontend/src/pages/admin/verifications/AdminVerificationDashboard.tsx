import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { adminVerificationApi } from "../../../api/verification.api";
import DocumentPreviewModal from "../../../components/verification/DocumentPreviewModal";
import VerificationStatusBadge from "../../../components/verification/VerificationStatusBadge";
import {
  ProviderVerification,
  UserVerification,
  VerificationStatus,
} from "../../../types/verification";

type Mode = "users" | "providers";

interface AdminVerificationDashboardProps {
  mode: Mode;
}

type ReviewRecord = UserVerification | ProviderVerification;

export default function AdminVerificationDashboard({
  mode,
}: AdminVerificationDashboardProps) {
  const [records, setRecords] = useState<ReviewRecord[]>([]);
  const [status, setStatus] = useState<VerificationStatus | "">("");
  const [search, setSearch] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [rejectingId, setRejectingId] = useState<string>();
  const [rejectionReason, setRejectionReason] = useState("");

  const loadRecords = async () => {
    try {
      const nextRecords =
        mode === "users"
          ? await adminVerificationApi.getUserVerifications(status || undefined, search)
          : await adminVerificationApi.getProviderVerifications(status || undefined, search);
      setRecords(nextRecords);
    } catch {
      toast.error("Failed to load verifications");
    }
  };

  useEffect(() => {
    void loadRecords();
  }, [mode, status]);

  const approve = async (id: string) => {
    try {
      const updated =
        mode === "users"
          ? await adminVerificationApi.approveUserVerification(id)
          : await adminVerificationApi.approveProviderVerification(id);
      setRecords((current) => current.map((record) => (record.id === id ? updated : record)));
      toast.success("Approved");
    } catch {
      toast.error("Approval failed");
    }
  };

  const reject = async () => {
    if (!rejectingId) return;

    try {
      const updated =
        mode === "users"
          ? await adminVerificationApi.rejectUserVerification(rejectingId, rejectionReason)
          : await adminVerificationApi.rejectProviderVerification(rejectingId, rejectionReason);
      setRecords((current) => current.map((record) => (record.id === rejectingId ? updated : record)));
      setRejectingId(undefined);
      setRejectionReason("");
      toast.success("Rejected");
    } catch {
      toast.error("Rejection failed");
    }
  };

  const getPrimaryDocumentUrl = (record: ReviewRecord) =>
    "frontDocumentUrl" in record ? record.frontDocumentUrl : record.documentUrl;

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-serif">
            {mode === "users" ? "User Identity Reviews" : "Provider License Reviews"}
          </h1>
          <p className="mt-1 text-sm text-white/45">Approve, reject, and inspect verification uploads.</p>
        </div>
        <div className="flex gap-2">
          <select className="profile-input" value={status} onChange={(event) => setStatus(event.target.value as VerificationStatus | "")}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input className="profile-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
          <button type="button" onClick={loadRecords} className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">
            Search
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-white/45">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Uploaded</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t border-white/10">
                <td className="px-4 py-3">{"documentType" in record ? record.documentType : record.licenseType}</td>
                <td className="px-4 py-3"><VerificationStatusBadge status={record.verificationStatus} /></td>
                <td className="px-4 py-3 text-white/50">{new Date(record.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setPreviewUrl(getPrimaryDocumentUrl(record))} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-white/70">
                      <Eye size={14} />
                      Preview
                    </button>
                    {record.verificationStatus === "pending" && (
                      <>
                        <button type="button" onClick={() => void approve(record.id)} className="rounded-lg bg-emerald-400/15 px-3 py-2 text-emerald-200">
                          Approve
                        </button>
                        <button type="button" onClick={() => setRejectingId(record.id)} className="rounded-lg bg-red-400/15 px-3 py-2 text-red-200">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#101010] p-5">
            <h2 className="text-lg font-medium">Reject verification</h2>
            <textarea className="profile-input mt-4 min-h-28" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder="Reason" />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setRejectingId(undefined)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70">
                Cancel
              </button>
              <button type="button" onClick={() => void reject()} className="rounded-lg bg-red-400 px-4 py-2 text-sm font-medium text-black">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <DocumentPreviewModal url={previewUrl} onClose={() => setPreviewUrl(undefined)} />
    </div>
  );
}

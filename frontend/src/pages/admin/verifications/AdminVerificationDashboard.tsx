import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Eye, FileSearch, Search, XCircle } from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const nextRecords =
        mode === "users"
          ? await adminVerificationApi.getUserVerifications(status || undefined, search)
          : await adminVerificationApi.getProviderVerifications(status || undefined, search);
      setRecords(nextRecords);
    } catch {
      toast.error("Failed to load verifications");
    } finally {
      setLoading(false);
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
    if (rejectionReason.trim().length < 3) {
      toast.error("Add a rejection reason");
      return;
    }

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
    <div className="max-w-[1400px] space-y-6 text-black">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-black/25">
            Verification
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em]">
            {mode === "users" ? "User Identity Reviews" : "Provider License Reviews"}
          </h1>
          <p className="mt-2 text-sm text-black/45">Approve, reject, and inspect verification uploads.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            className="min-h-10 rounded-lg border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-black/30"
            value={status}
            onChange={(event) => setStatus(event.target.value as VerificationStatus | "")}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            className="min-h-10 rounded-lg border border-black/10 bg-white px-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/30"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
          />
          <button
            type="button"
            onClick={loadRecords}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            <Search size={15} />
            Search
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {(["pending", "approved", "rejected"] as VerificationStatus[]).map((item) => (
          <div key={item} className="rounded-lg border border-black/[0.06] bg-white p-5">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/25">{item}</p>
            <p className="mt-2 text-3xl font-black">
              {records.filter((record) => record.verificationStatus === item).length}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-black/[0.06] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/[0.03] text-black/45">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Uploaded</th>
              <th className="px-4 py-3">Documents</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-black/35">
                  Loading verification records...
                </td>
              </tr>
            )}

            {!loading && records.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12">
                  <div className="flex flex-col items-center text-center text-black/35">
                    <FileSearch size={34} />
                    <p className="mt-3 text-sm">No verification uploads found.</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && records.map((record) => (
              <tr key={record.id} className="border-t border-black/[0.06]">
                <td className="px-4 py-3">{"documentType" in record ? record.documentType : record.licenseType}</td>
                <td className="px-4 py-3"><VerificationStatusBadge status={record.verificationStatus} /></td>
                <td className="px-4 py-3 text-black/50">{new Date(record.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setPreviewUrl(getPrimaryDocumentUrl(record))} className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-3 py-2 text-black/70 hover:bg-black/[0.03]">
                      <Eye size={14} />
                      {"frontDocumentUrl" in record ? "Front" : "Document"}
                    </button>
                    {"backDocumentUrl" in record && record.backDocumentUrl && (
                      <button type="button" onClick={() => setPreviewUrl(record.backDocumentUrl)} className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-3 py-2 text-black/70 hover:bg-black/[0.03]">
                        <Eye size={14} />
                        Back
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {record.verificationStatus === "pending" && (
                      <>
                        <button type="button" onClick={() => void approve(record.id)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-white">
                          <CheckCircle2 size={14} />
                          Approve
                        </button>
                        <button type="button" onClick={() => setRejectingId(record.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-white">
                          <XCircle size={14} />
                          Reject
                        </button>
                      </>
                    )}
                    {record.verificationStatus !== "pending" && (
                      <span className="text-sm text-black/35">Reviewed</span>
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
          <div className="w-full max-w-md rounded-lg bg-white p-5 text-black shadow-2xl">
            <h2 className="text-lg font-medium">Reject verification</h2>
            <textarea
              className="mt-4 min-h-28 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none placeholder:text-black/30 focus:border-black/30"
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Reason"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setRejectingId(undefined)} className="rounded-lg border border-black/10 px-4 py-2 text-sm text-black/60">
                Cancel
              </button>
              <button type="button" onClick={() => void reject()} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white">
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

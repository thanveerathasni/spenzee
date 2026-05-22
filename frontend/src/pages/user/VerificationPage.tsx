import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DocumentPreviewModal from "../../components/verification/DocumentPreviewModal";
import DocumentUploadPanel from "../../components/verification/DocumentUploadPanel";
import VerificationStatusBadge from "../../components/verification/VerificationStatusBadge";
import VerificationTimeline from "../../components/verification/VerificationTimeline";
import { userVerificationApi } from "../../api/verification.api";
import { UserDocumentType, UserVerification } from "../../types/verification";

export default function VerificationPage() {
  const [verification, setVerification] = useState<UserVerification | null>(null);
  const [documentType, setDocumentType] = useState<UserDocumentType>("aadhaar");
  const [frontDocument, setFrontDocument] = useState<File | null>(null);
  const [backDocument, setBackDocument] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setVerification(await userVerificationApi.getStatus());
    } catch {
      toast.error("Failed to load verification status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  const canUpload =
    !verification ||
    verification.verificationStatus === "rejected";

  const submit = async () => {
    if (!frontDocument) {
      toast.error("Upload front document");
      return;
    }

    try {
      setUploading(true);
      const next = await userVerificationApi.submit({
        documentType,
        frontDocument,
        backDocument: backDocument ?? undefined,
      });
      setVerification(next);
      setFrontDocument(null);
      setBackDocument(null);
      toast.success("Verification submitted");
    } catch {
      toast.error("Failed to submit verification");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] p-6 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif">Identity Verification</h1>
            <p className="mt-1 text-sm text-white/45">Submit identity proof before bank statement upload.</p>
          </div>
          <VerificationStatusBadge status={verification?.verificationStatus} />
        </div>

        {loading ? (
          <div className="h-32 animate-pulse rounded-lg bg-white/[0.04]" />
        ) : (
          <>
            {verification && (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setPreviewUrl(verification.frontDocumentUrl)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70">
                    Preview front
                  </button>
                  {verification.backDocumentUrl && (
                    <button type="button" onClick={() => setPreviewUrl(verification.backDocumentUrl)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70">
                      Preview back
                    </button>
                  )}
                </div>
                {verification.rejectionReason && (
                  <p className="mb-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
                    {verification.rejectionReason}
                  </p>
                )}
                <VerificationTimeline
                  status={verification.verificationStatus}
                  submittedAt={verification.createdAt}
                  reviewedAt={verification.reviewedAt}
                />
              </div>
            )}

            {canUpload && (
              <DocumentUploadPanel
                title={verification?.verificationStatus === "rejected" ? "Re-upload identity proof" : "Upload identity proof"}
                description="Images and PDFs are supported."
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <select className="profile-input" value={documentType} onChange={(event) => setDocumentType(event.target.value as UserDocumentType)}>
                    <option value="aadhaar">Aadhaar</option>
                    <option value="passport">Passport</option>
                    <option value="driving_license">Driving License</option>
                    <option value="national_id">National ID</option>
                  </select>
                  <input className="profile-input" type="file" accept="image/*,.pdf" onChange={(event) => setFrontDocument(event.target.files?.[0] ?? null)} />
                  <input className="profile-input md:col-span-2" type="file" accept="image/*,.pdf" onChange={(event) => setBackDocument(event.target.files?.[0] ?? null)} />
                </div>
                <button type="button" onClick={submit} disabled={uploading} className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50">
                  {uploading ? "Uploading" : "Submit"}
                </button>
              </DocumentUploadPanel>
            )}
          </>
        )}
      </div>
      <DocumentPreviewModal url={previewUrl} onClose={() => setPreviewUrl(undefined)} />
    </main>
  );
}

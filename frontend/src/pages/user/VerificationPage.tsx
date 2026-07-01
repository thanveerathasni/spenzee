import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, FileCheck2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import DocumentPreviewModal from "../../components/verification/DocumentPreviewModal";
import DocumentFileInput from "../../components/verification/DocumentFileInput";
import DocumentUploadPanel from "../../components/verification/DocumentUploadPanel";
import VerificationStatusBadge from "../../components/verification/VerificationStatusBadge";
import VerificationTimeline from "../../components/verification/VerificationTimeline";
import { userVerificationApi } from "../../api/verification.api";
import { UserDocumentType, UserVerification } from "../../types/verification";
import { ROUTES } from "../../constants/routes";

export default function VerificationPage() {
  const [verification, setVerification] = useState<UserVerification | null>(null);
  const [documentType, setDocumentType] = useState<UserDocumentType>("aadhaar");
  const [frontDocument, setFrontDocument] = useState<File | null>(null);
  const [backDocument, setBackDocument] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>();
  const [bankUploadAllowed, setBankUploadAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const [status, access] = await Promise.all([
        userVerificationApi.getStatus(),
        userVerificationApi.checkBankUploadAccess(),
      ]);
      setVerification(status);
      setBankUploadAllowed(access);
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

  const documentLabel =
    documentType === "aadhaar"
      ? "Aadhaar"
      : documentType === "driving_license"
        ? "Driving License"
        : documentType === "national_id"
          ? "National ID"
          : "Passport";

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
      setBankUploadAllowed(next.verificationStatus === "approved");
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
        <Link
          to={ROUTES.USER.DASHBOARD}
          className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-serif">Identity Verification</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/45">
              Submit a clear government document for review. Bank statement upload unlocks after identity approval.
            </p>
          </div>
          <VerificationStatusBadge status={verification?.verificationStatus} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">Identity status</p>
                <p className="mt-1 text-sm capitalize text-white/45">
                  {verification?.verificationStatus ?? "Not submitted"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black">
                <FileCheck2 size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">Bank statement upload</p>
                <p className="mt-1 text-sm text-white/45">
                  {bankUploadAllowed ? "Unlocked" : "Locked until approval"}
                </p>
              </div>
            </div>
          </div>
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
                description="Use a readable file under 10 MB. Front document is required; back document is optional unless your document has two sides."
              >
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.25em] text-white/45">
                      Document type
                    </label>
                    <select className="profile-input" value={documentType} onChange={(event) => setDocumentType(event.target.value as UserDocumentType)}>
                      <option value="aadhaar">Aadhaar</option>
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving License</option>
                      <option value="national_id">National ID</option>
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <DocumentFileInput
                      label={`${documentLabel} front`}
                      helper="Photo page, front side, or primary identity page."
                      file={frontDocument}
                      required
                      onChange={setFrontDocument}
                      onPreview={setLocalPreviewUrl}
                      onError={toast.error}
                    />
                    <DocumentFileInput
                      label={`${documentLabel} back`}
                      helper="Upload the back side if the document has one."
                      file={backDocument}
                      onChange={setBackDocument}
                      onPreview={setLocalPreviewUrl}
                      onError={toast.error}
                    />
                  </div>
                </div>
                <button type="button" onClick={submit} disabled={uploading} className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50">
                  {uploading ? "Uploading" : "Submit"}
                </button>
              </DocumentUploadPanel>
            )}

            {!canUpload && (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-white/50">
                {verification?.verificationStatus === "approved"
                  ? "Your identity is approved. Bank statement upload is available."
                  : "Your document is under review. You can upload again only if it is rejected."}
              </div>
            )}
          </>
        )}
      </div>
      <DocumentPreviewModal url={previewUrl} onClose={() => setPreviewUrl(undefined)} />
      <DocumentPreviewModal url={localPreviewUrl} onClose={() => setLocalPreviewUrl(undefined)} />
    </main>
  );
}

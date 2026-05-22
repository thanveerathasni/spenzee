import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { providerVerificationApi } from "../../api/verification.api";
import DocumentPreviewModal from "../../components/verification/DocumentPreviewModal";
import DocumentUploadPanel from "../../components/verification/DocumentUploadPanel";
import VerificationStatusBadge from "../../components/verification/VerificationStatusBadge";
import VerificationTimeline from "../../components/verification/VerificationTimeline";
import { ProviderLicenseType, ProviderVerification as ProviderVerificationRecord } from "../../types/verification";

export default function ProviderVerification() {
  const [verification, setVerification] = useState<ProviderVerificationRecord | null>(null);
  const [licenseType, setLicenseType] = useState<ProviderLicenseType>("trade_license");
  const [document, setDocument] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    void providerVerificationApi.getStatus().then(setVerification).catch(() => {
      toast.error("Failed to load license verification");
    });
  }, []);

  const canUpload = !verification || verification.verificationStatus === "rejected";

  const submit = async () => {
    if (!document) {
      toast.error("Upload license document");
      return;
    }

    try {
      setUploading(true);
      setVerification(await providerVerificationApi.submit({ licenseType, document }));
      setDocument(null);
      toast.success("License submitted");
    } catch {
      toast.error("Failed to submit license");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif">License Verification</h1>
          <p className="mt-1 text-sm text-white/45">Upload business verification documents for admin approval.</p>
        </div>
        <VerificationStatusBadge status={verification?.verificationStatus} />
      </div>

      {verification && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <button type="button" onClick={() => setPreviewUrl(verification.documentUrl)} className="mb-4 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70">
            Preview document
          </button>
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
        <DocumentUploadPanel title="Upload provider license" description="Trade license, GST certificate, or registration proof.">
          <div className="grid gap-3 md:grid-cols-2">
            <select className="profile-input" value={licenseType} onChange={(event) => setLicenseType(event.target.value as ProviderLicenseType)}>
              <option value="trade_license">Trade License</option>
              <option value="gst_certificate">GST Certificate</option>
              <option value="business_registration">Business Registration Proof</option>
            </select>
            <input className="profile-input" type="file" accept="image/*,.pdf" onChange={(event) => setDocument(event.target.files?.[0] ?? null)} />
          </div>
          <button type="button" onClick={submit} disabled={uploading} className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50">
            {uploading ? "Uploading" : "Submit"}
          </button>
        </DocumentUploadPanel>
      )}

      <DocumentPreviewModal url={previewUrl} onClose={() => setPreviewUrl(undefined)} />
    </div>
  );
}

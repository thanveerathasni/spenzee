import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  Building2,
  FileBadge2,
  ShieldCheck,
  Upload,
} from "lucide-react";

import { providerVerificationApi } from "../../api/verification.api";

import DocumentFileInput from "../../components/verification/DocumentFileInput";

import DocumentPreviewModal from "../../components/verification/DocumentPreviewModal";

import DocumentUploadPanel from "../../components/verification/DocumentUploadPanel";

import VerificationStatusBadge from "../../components/verification/VerificationStatusBadge";

import VerificationTimeline from "../../components/verification/VerificationTimeline";

import {
  ProviderLicenseType,
  ProviderVerification as ProviderVerificationRecord,
} from "../../types/verification";

export default function ProviderVerification() {
  const [
    verification,
    setVerification,
  ] = useState<ProviderVerificationRecord | null>(
    null,
  );

  const [
    licenseType,
    setLicenseType,
  ] = useState<ProviderLicenseType>(
    "trade_license",
  );

  const [
    document,
    setDocument,
  ] = useState<File | null>(
    null,
  );

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<string>();

  const [
    localPreviewUrl,
    setLocalPreviewUrl,
  ] = useState<string>();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  useEffect(() => {
    void providerVerificationApi
      .getStatus()
      .then(setVerification)
      .catch(() => {
        toast.error(
          "Failed to load verification",
        );
      })
      .finally(() =>
        setLoading(false),
      );
  }, []);

  const canUpload =
    !verification ||
    verification.verificationStatus ===
      "rejected";

  const licenseLabel =
    licenseType ===
    "gst_certificate"
      ? "GST Certificate"
      : licenseType ===
          "business_registration"
        ? "Business Registration"
        : "Trade License";

  const currentLicenseLabel =
    verification?.licenseType ===
    "gst_certificate"
      ? "GST Certificate"
      : verification?.licenseType ===
          "business_registration"
        ? "Business Registration"
        : verification?.licenseType ===
            "trade_license"
          ? "Trade License"
          : "Upload required";

  const submit =
    async () => {
      if (!document) {
        toast.error(
          "Upload license document",
        );

        return;
      }

      try {
        setUploading(true);

        const response =
          await providerVerificationApi.submit(
            {
              licenseType,
              document,
            },
          );

        setVerification(
          response,
        );

        setDocument(
          null,
        );

        toast.success(
          "License submitted successfully",
        );
      } catch {
        toast.error(
          "Failed to submit verification",
        );
      } finally {
        setUploading(
          false,
        );
      }
    };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-36 rounded-2xl bg-gray-100" />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-32 rounded-2xl bg-gray-100" />
          <div className="h-32 rounded-2xl bg-gray-100" />
        </div>

        <div className="h-80 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <>
      <DocumentPreviewModal
        url={previewUrl}
        onClose={() =>
          setPreviewUrl(
            undefined,
          )
        }
      />

      <DocumentPreviewModal
        url={
          localPreviewUrl
        }
        onClose={() =>
          setLocalPreviewUrl(
            undefined,
          )
        }
      />

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex items-start justify-between gap-4">
          <div className="absolute top-0 left-0 w-1 h-full bg-black" />

          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-gray-900">
              Provider Verification
            </h1>

            <p className="mt-2 text-sm text-gray-500 max-w-2xl leading-relaxed">
              Upload your
              business
              verification
              documents for
              admin approval.
              Ensure all
              files are clear,
              readable, and
              valid.
            </p>
          </div>

          <VerificationStatusBadge
            status={
              verification?.verificationStatus
            }
          />
        </div>

        {/* ====================================================== */}
        {/* STATUS CARDS */}
        {/* ====================================================== */}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
                <Building2
                  size={20}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Provider
                  Status
                </p>

                <p className="mt-2 text-base font-semibold capitalize text-gray-900">
                  {verification?.verificationStatus ??
                    "Not Submitted"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
                <FileBadge2
                  size={20}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Current
                  Document
                </p>

                <p className="mt-2 text-base font-semibold text-gray-900">
                  {
                    currentLicenseLabel
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* EXISTING VERIFICATION */}
        {/* ====================================================== */}

        {verification && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Verification
                  Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review your
                  submitted
                  verification
                  document and
                  status.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewUrl(
                    verification.documentUrl,
                  )
                }
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Preview
                Document
              </button>
            </div>

            {verification.rejectionReason && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">
                  {
                    verification.rejectionReason
                  }
                </p>
              </div>
            )}

            <VerificationTimeline
              status={
                verification.verificationStatus
              }
              submittedAt={
                verification.createdAt
              }
              reviewedAt={
                verification.reviewedAt
              }
            />
          </div>
        )}

        {/* ====================================================== */}
        {/* UPLOAD PANEL */}
        {/* ====================================================== */}

        {canUpload && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
                <Upload
                  size={20}
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Upload
                  Verification
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Upload trade
                  license, GST
                  certificate,
                  or registration
                  proof.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  License Type
                </label>

                <select
                  value={
                    licenseType
                  }
                  onChange={(
                    event,
                  ) =>
                    setLicenseType(
                      event.target
                        .value as ProviderLicenseType,
                    )
                  }
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium text-sm"
                >
                  <option value="trade_license">
                    Trade License
                  </option>

                  <option value="gst_certificate">
                    GST Certificate
                  </option>

                  <option value="business_registration">
                    Business
                    Registration
                    Proof
                  </option>
                </select>
              </div>

              <DocumentFileInput
                label={
                  licenseLabel
                }
                helper="Upload official business verification documents."
                file={document}
                required
                onChange={
                  setDocument
                }
                onPreview={
                  setLocalPreviewUrl
                }
                onError={
                  toast.error
                }
              />

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={
                    submit
                  }
                  disabled={
                    uploading
                  }
                  className="px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {uploading
                    ? "Uploading..."
                    : "Submit Verification"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================== */}
        {/* FINAL STATUS */}
        {/* ====================================================== */}

        {!canUpload && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500 leading-relaxed">
              {verification?.verificationStatus ===
              "approved"
                ? "Your provider verification has already been approved."
                : "Your verification is currently under review. You can upload again only if your verification gets rejected."}
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}


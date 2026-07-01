import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  ExternalLink,
  Globe,
  Mail,
  PauseCircle,
  Percent,
  Phone,
  PlayCircle,
  ShieldCheck,
  ShieldOff,
  Store,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { adminUserApi } from "../../../api/admin/adminUser.api";
import { ROUTES } from "../../../constants/routes";
import { AdminProvider, CommerceStatus, ProviderStatus } from "../../../types/provider";

const easeOutQuart = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOutQuart } },
};

const statusStyles: Record<ProviderStatus, string> = {
  active: "border-emerald-100 bg-emerald-50 text-emerald-600",
  suspended: "border-red-100 bg-red-50 text-red-500",
  blocked: "border-zinc-200 bg-zinc-100 text-zinc-600",
  pending: "border-amber-100 bg-amber-50 text-amber-600",
  rejected: "border-rose-100 bg-rose-50 text-rose-500",
};

const commerceStatusStyles: Record<CommerceStatus, string> = {
  PENDING: "border-amber-100 bg-amber-50 text-amber-600",
  APPROVED: "border-emerald-100 bg-emerald-50 text-emerald-600",
  REJECTED: "border-rose-100 bg-rose-50 text-rose-500",
  FROZEN: "border-blue-100 bg-blue-50 text-blue-600",
};

interface InfoRowProps {
  label: string;
  value?: string | boolean;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="flex items-center justify-between gap-4 px-6 py-4">
    <span className="text-[10px] font-black uppercase tracking-widest text-black/30">
      {label}
    </span>
    <span className="text-right text-[11px] font-black uppercase tracking-wide text-black">
      {typeof value === "boolean" ? (value ? "Yes" : "No") : value || "Not provided"}
    </span>
  </div>
);

export default function AdminProviderDetails() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<AdminProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const providerId = id ?? "";

  const joinedAt = useMemo(() => {
    if (!provider) return "";
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(provider.createdAt));
  }, [provider]);

  const loadProvider = async () => {
    if (!providerId) return;

    try {
      setLoading(true);
      setProvider(await adminUserApi.getProviderById(providerId));
    } catch {
      toast.error("Failed to load provider");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProvider();
  }, [providerId]);

  const updateStatus = async (nextStatus: "active" | "suspended" | "blocked") => {
    if (!provider) return;

    const result = await Swal.fire({
      title: `${nextStatus === "active" ? "Activate" : nextStatus === "blocked" ? "Block" : "Suspend"} provider?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nextStatus === "active" ? "#059669" : "#111111",
      confirmButtonText: "Confirm",
      background: "#fff",
      color: "#111",
    });

    if (!result.isConfirmed) return;

    try {
      setUpdating(true);
      await adminUserApi.updateProviderStatus(provider.id, nextStatus);
      setProvider({ ...provider, status: nextStatus });
      toast.success("Provider status updated");
    } catch {
      toast.error("Status update failed");
    } finally {
      setUpdating(false);
    }
  };

  const approveCommerce = async () => {
    if (!provider) return;

    const result = await Swal.fire({
      title: "Approve commerce?",
      input: "number",
      inputLabel: "Commission percentage",
      inputValue: provider.commissionPercentage,
      inputAttributes: {
        min: "0",
        max: "100",
        step: "0.01",
      },
      showCancelButton: true,
      confirmButtonText: "Approve",
      confirmButtonColor: "#059669",
      background: "#fff",
      color: "#111",
    });

    if (!result.isConfirmed) return;

    const commissionPercentage =
      Number(result.value);

    try {
      setUpdating(true);
      setProvider(await adminUserApi.approveProviderCommerce(provider.id, commissionPercentage));
      toast.success("Commerce approved");
    } catch {
      toast.error("Commerce approval failed");
    } finally {
      setUpdating(false);
    }
  };

  const rejectCommerce = async () => {
    if (!provider) return;

    const result = await Swal.fire({
      title: "Reject commerce?",
      input: "textarea",
      inputLabel: "Reason",
      inputPlaceholder: "Enter rejection reason",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#e11d48",
      background: "#fff",
      color: "#111",
    });

    if (!result.isConfirmed || typeof result.value !== "string") return;

    try {
      setUpdating(true);
      setProvider(await adminUserApi.rejectProviderCommerce(provider.id, result.value));
      toast.success("Commerce rejected");
    } catch {
      toast.error("Commerce rejection failed");
    } finally {
      setUpdating(false);
    }
  };

  const updateCommerceState = async (action: "freeze" | "resume") => {
    if (!provider) return;

    const result = await Swal.fire({
      title: `${action === "freeze" ? "Freeze" : "Resume"} commerce?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: action === "resume" ? "#059669" : "#111111",
      confirmButtonText: "Confirm",
      background: "#fff",
      color: "#111",
    });

    if (!result.isConfirmed) return;

    try {
      setUpdating(true);
      setProvider(
        action === "freeze"
          ? await adminUserApi.freezeProviderCommerce(provider.id)
          : await adminUserApi.resumeProviderCommerce(provider.id),
      );
      toast.success(`Commerce ${action === "freeze" ? "frozen" : "resumed"}`);
    } catch {
      toast.error("Commerce update failed");
    } finally {
      setUpdating(false);
    }
  };

  const updateCommission = async () => {
    if (!provider) return;

    const result = await Swal.fire({
      title: "Update commission",
      input: "number",
      inputLabel: "Commission percentage",
      inputValue: provider.commissionPercentage,
      inputAttributes: {
        min: "0",
        max: "100",
        step: "0.01",
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#111111",
      background: "#fff",
      color: "#111",
    });

    if (!result.isConfirmed) return;

    try {
      setUpdating(true);
      setProvider(await adminUserApi.updateProviderCommission(provider.id, Number(result.value)));
      toast.success("Commission updated");
    } catch {
      toast.error("Commission update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20"
        >
          Loading provider...
        </motion.div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="rounded-2xl border border-black/[0.06] bg-white p-8">
        <p className="text-sm text-black/50">Provider could not be found.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-[1100px] space-y-6"
    >
      <motion.div variants={item}>
        <Link
          to={ROUTES.ADMIN.PROVIDERS}
          className="mb-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/35 transition hover:text-black"
        >
          <ArrowLeft size={13} />
          Providers
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
              {provider.profileImage ? (
                <img
                  src={provider.profileImage}
                  alt={provider.brandName}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <Building2 size={22} />
              )}
            </div>
            <div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.4em] text-black/25">
                Provider Profile
              </p>
              <h1 className="text-3xl font-black uppercase leading-none tracking-[-0.04em] text-black">
                {provider.brandName}
              </h1>
              <p className="mt-2 text-sm text-black/40">{provider.primaryCategory}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-xl border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] ${statusStyles[provider.status]}`}
            >
              {provider.status}
            </span>
            <button
              type="button"
              disabled={updating || provider.status === "active"}
              onClick={() => void updateStatus("active")}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShieldCheck size={13} />
              Activate
            </button>
            <button
              type="button"
              disabled={updating || provider.status === "suspended"}
              onClick={() => void updateStatus("suspended")}
              className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShieldOff size={13} />
              Suspend
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          variants={item}
          className="rounded-2xl border border-black/[0.06] bg-white p-6 lg:col-span-2"
        >
          <p className="mb-4 text-[9px] font-black uppercase tracking-[0.35em] text-black/25">
            Overview
          </p>
          <p className="min-h-20 text-sm leading-7 text-black/55">
            {provider.description || "No provider description has been added yet."}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={`mailto:${provider.email}`}
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black/45 transition hover:text-black"
            >
              <Mail size={13} />
              Email
            </a>
            {provider.phone && (
              <a
                href={`tel:${provider.phone}`}
                className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black/45 transition hover:text-black"
              >
                <Phone size={13} />
                Call
              </a>
            )}
            {provider.websiteUrl && (
              <a
                href={provider.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black/45 transition hover:text-black"
              >
                <ExternalLink size={13} />
                Website
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="rounded-2xl border border-black/[0.06] bg-white p-6"
        >
          <p className="mb-5 text-[9px] font-black uppercase tracking-[0.35em] text-black/25">
            Readiness
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <BadgeCheck className={provider.hasAcceptedTerms ? "text-emerald-500" : "text-black/20"} size={17} />
              <span className="text-xs font-bold uppercase tracking-widest text-black/55">
                Terms {provider.hasAcceptedTerms ? "accepted" : "pending"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className={provider.websiteUrl ? "text-emerald-500" : "text-black/20"} size={17} />
              <span className="text-xs font-bold uppercase tracking-widest text-black/55">
                Website {provider.websiteUrl ? "linked" : "missing"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={item}
        className="rounded-2xl border border-black/[0.06] bg-white p-6"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-3 text-[9px] font-black uppercase tracking-[0.35em] text-black/25">
              Commerce Activation
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-xl border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] ${commerceStatusStyles[provider.commerceStatus]}`}
              >
                {provider.commerceStatus}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-black/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black/45">
                <Percent size={13} />
                {provider.commissionPercentage}% commission
              </span>
            </div>
            {provider.commerceRejectedReason && (
              <p className="mt-3 text-xs font-semibold text-rose-500">
                {provider.commerceRejectedReason}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={updating || provider.commerceStatus === "APPROVED"}
              onClick={() => void approveCommerce()}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Store size={13} />
              Approve
            </button>
            <button
              type="button"
              disabled={updating || provider.commerceStatus === "REJECTED"}
              onClick={() => void rejectCommerce()}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <XCircle size={13} />
              Reject
            </button>
            <button
              type="button"
              disabled={updating || provider.commerceStatus !== "APPROVED"}
              onClick={() => void updateCommerceState("freeze")}
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black/45 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <PauseCircle size={13} />
              Freeze
            </button>
            <button
              type="button"
              disabled={updating || provider.commerceStatus !== "FROZEN"}
              onClick={() => void updateCommerceState("resume")}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <PlayCircle size={13} />
              Resume
            </button>
            <button
              type="button"
              disabled={updating}
              onClick={() => void updateCommission()}
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black/45 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Percent size={13} />
              Commission
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        {[
          {
            title: "Business Info",
            rows: [
              ["Brand Name", provider.brandName],
              ["Company Name", provider.companyName],
              ["Primary Category", provider.primaryCategory],
              ["GST Number", provider.gstNumber],
              ["License Number", provider.licenseNumber],
            ],
          },
          {
            title: "Contact And Account",
            rows: [
              ["Email", provider.email],
              ["Phone", provider.phone],
              ["Website", provider.websiteUrl],
              ["Joined", joinedAt],
              ["Provider ID", provider.id],
              ["Terms Accepted", provider.hasAcceptedTerms],
            ],
          },
        ].map((section) => (
          <motion.div
            key={section.title}
            variants={item}
            className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white"
          >
            <div className="border-b border-black/[0.05] bg-black/[0.02] px-6 py-4">
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-black/25">
                {section.title}
              </p>
            </div>
            <div className="divide-y divide-black/[0.04]">
              {section.rows.map(([label, value]) => (
                <InfoRow key={String(label)} label={String(label)} value={value} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

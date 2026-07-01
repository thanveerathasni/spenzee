import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  BarChart3,
  FileUp,
  Home,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ROUTES } from "../../constants/routes";
import { userProfileApi } from "../../api/user/userProfile.api";
import { userVerificationApi } from "../../api/verification.api";
import type { Address, User } from "../../types/user";
import type { UserVerification } from "../../types/verification";
import NotificationBell from "../../components/notification/NotificationBell";

export default function UserDashboard() {
  const [user, setUser] =
    useState<User | null>(null);
  const [addresses, setAddresses] =
    useState<Address[]>([]);
  const [verification, setVerification] =
    useState<UserVerification | null>(null);
  const [bankAccess, setBankAccess] =
    useState(false);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          profile,
          addressList,
          verificationStatus,
          canUploadBank,
        ] = await Promise.all([
          userProfileApi.getProfile(),
          userProfileApi.getAddresses(),
          userVerificationApi.getStatus(),
          userVerificationApi.checkBankUploadAccess(),
        ]);

        setUser(profile);
        setAddresses(addressList);
        setVerification(verificationStatus);
        setBankAccess(canUploadBank);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const verificationLabel = useMemo(
    () =>
      verification?.verificationStatus
        ? verification.verificationStatus.replace("_", " ")
        : "Not submitted",
    [verification],
  );

  const cards = [
    {
      label: "Profile",
      value: user?.name ?? "Loading",
      detail: user?.email ?? "Account details",
      icon: UserRound,
      href: ROUTES.USER.PROFILE,
    },
    {
      label: "Addresses",
      value: String(addresses.length),
      detail: addresses.length === 1 ? "Saved address" : "Saved addresses",
      icon: MapPin,
      href: ROUTES.USER.PROFILE,
    },
    {
      label: "Verification",
      value: verificationLabel,
      detail: "Identity approval status",
      icon: ShieldCheck,
      href: ROUTES.USER.VERIFICATION,
    },
    {
      label: "Bank Upload",
      value: bankAccess ? "Unlocked" : "Locked",
      detail: bankAccess ? "Identity approved" : "Complete verification first",
      icon: FileUp,
      href: ROUTES.USER.FINANCIAL_INSIGHTS_UPLOAD,
    },
    {
      label: "Financial Insights",
      value: bankAccess ? "Ready" : "Locked",
      detail: "Statement analytics and risk intelligence",
      icon: BarChart3,
      href: ROUTES.USER.FINANCIAL_INSIGHTS,
    },
  ];

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/35">
              Spenzee
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/45">
              Manage the account features currently backed by the API.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell tone="dark" />
            <Link
              to={ROUTES.USER.PROFILE}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black"
            >
              <Home size={16} />
              Open profile
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-lg border border-white/10 bg-white/[0.04]"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black">
                      <Icon size={18} />
                    </div>
                    {card.label === "Verification" && verification?.verificationStatus === "approved" && (
                      <BadgeCheck size={18} className="text-emerald-300" />
                    )}
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
                    {card.label}
                  </p>
                  <p className="mt-2 truncate text-xl font-semibold capitalize">
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    {card.detail}
                  </p>

                  <Link
                    to={card.href}
                    className="mt-5 inline-flex text-sm font-medium text-white/70 hover:text-white"
                  >
                    Manage
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-semibold">Available Workflows</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link to={ROUTES.USER.PROFILE} className="rounded-lg border border-white/10 p-4 text-sm text-white/70 hover:bg-white/[0.04]">
              Profile, email, password, image, and addresses
            </Link>
            <Link to={ROUTES.USER.VERIFICATION} className="rounded-lg border border-white/10 p-4 text-sm text-white/70 hover:bg-white/[0.04]">
              Identity document upload and review status
            </Link>
            <Link to={ROUTES.USER.FINANCIAL_INSIGHTS} className="rounded-lg border border-white/10 p-4 text-sm text-white/70 hover:bg-white/[0.04]">
              Financial insights and statement intelligence
            </Link>
          </div>
        </section> */}
      </div>
    </main>
  );
}

import type { ReactNode } from "react";
import {
  useMemo,
  useState,
} from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  BarChart3,
  FileText,
  Home,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  ShieldCheck,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import NotificationBell from "../components/notification/NotificationBell";
import { authApi } from "../api/auth.api";
import { ROUTES } from "../constants/routes";
import {
  useAppDispatch,
} from "../store/hooks";
import {
  clearAuth,
} from "../store/auth";
import {
  clearPersistedAuth,
} from "../store/auth/authStorage";

interface UserFinancialLayoutProps {
  children?: ReactNode;
}

export default function UserFinancialLayout({
  children,
}: UserFinancialLayoutProps) {
  const [expanded, setExpanded] =
    useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const primaryItems = useMemo(
    () => [
      {
        label: "Dashboard",
        href: ROUTES.USER.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        label: "Financial Insights",
        href: ROUTES.USER.FINANCIAL_INSIGHTS,
        icon: BarChart3,
      },
      {
        label: "Profile",
        href: ROUTES.USER.PROFILE,
        icon: User,
      },
      {
        label: "Verification",
        href: ROUTES.USER.VERIFICATION,
        icon: ShieldCheck,
      },
    ],
    [],
  );

  const financialItems = useMemo(
    () => [
      {
        label: "Overview",
        href: ROUTES.USER.FINANCIAL_INSIGHTS,
        icon: Home,
      },
      {
        label: "Upload Statements",
        href: ROUTES.USER.FINANCIAL_INSIGHTS_UPLOAD,
        icon: UploadCloud,
      },
      {
        label: "Statement History",
        href: ROUTES.USER.FINANCIAL_INSIGHTS_STATEMENTS,
        icon: FileText,
      },
      {
        label: "Analytics",
        href: ROUTES.USER.FINANCIAL_INSIGHTS_ANALYTICS,
        icon: LineChart,
      },
    ],
    [],
  );

  const isPrimaryActive = (
    href: string,
  ) =>
    href === ROUTES.USER.FINANCIAL_INSIGHTS
      ? location.pathname.startsWith(
        ROUTES.USER.FINANCIAL_INSIGHTS,
      ) ||
        location.pathname ===
          ROUTES.USER.FINANCIAL_INSIGHTS_DASHBOARD
      : location.pathname.startsWith(
        href,
      );

  const isFinancialActive = (
    href: string,
  ) =>
    href === ROUTES.USER.FINANCIAL_INSIGHTS
      ? location.pathname === href ||
        location.pathname ===
          ROUTES.USER.FINANCIAL_INSIGHTS_DASHBOARD
      : location.pathname.startsWith(
        href,
      );

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Log out?",
      text: "You will be signed out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#111827",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Logout",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await authApi.logout();
    } catch {
      // Session cleanup still happens locally.
    } finally {
      clearPersistedAuth();
      dispatch(clearAuth());
      navigate(ROUTES.AUTH.LOGIN, {
        replace: true,
      });
    }
  };

  return (
    <motion.div className="min-h-screen bg-[#F5F6F8] text-black">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/[0.06] bg-white px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              setExpanded((value) => !value)
            }
            className="rounded-xl p-2 text-black/55 transition hover:bg-black/[0.04] hover:text-black"
          >
            {expanded ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
          <Link
            to={ROUTES.USER.DASHBOARD}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-black italic tracking-tighter">
              SPENZEE
            </span>
            <span className="hidden text-[10px] font-black uppercase tracking-widest text-black/35 sm:inline">
              User
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {primaryItems.map((item) => {
            const active = isPrimaryActive(
              item.href,
            );

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition ${
                  active
                    ? "bg-black text-white"
                    : "text-black/45 hover:bg-black/[0.04] hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-black/45 transition hover:bg-black/[0.04] hover:text-black sm:inline-flex"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside
          className={`fixed inset-y-16 left-0 z-20 flex flex-col border-r border-black/[0.06] bg-white transition-all duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] ${
            expanded
              ? "w-72 translate-x-0"
              : "w-16 -translate-x-full md:translate-x-0"
          }`}
        >
          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {primaryItems.map((item) => {
                const Icon = item.icon;
                const active = isPrimaryActive(
                  item.href,
                );

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    title={
                      expanded
                        ? undefined
                        : item.label
                    }
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-black text-white"
                        : "text-black/55 hover:bg-black/[0.04] hover:text-black"
                    }`}
                  >
                    <Icon size={18} />
                    {expanded && (
                      <span className="font-bold">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div>
              {expanded && (
                <p className="px-3 pb-2 text-[9px] font-black uppercase tracking-[0.28em] text-black/25">
                  Financial Insights
                </p>
              )}
              <div className="space-y-1">
                {financialItems.map((item) => {
                  const Icon = item.icon;
                  const active = isFinancialActive(
                    item.href,
                  );

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      title={
                        expanded
                          ? undefined
                          : item.label
                      }
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        active
                          ? "bg-black text-white shadow-sm"
                          : "text-black/55 hover:bg-black/[0.04] hover:text-black"
                      }`}
                    >
                      <Icon size={18} />
                      {expanded && (
                        <span className="font-bold">
                          {item.label}
                        </span>
                      )}
                      {active && expanded && (
                        <motion.span
                          layoutId="financial-active"
                          className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </aside>

        {expanded && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setExpanded(false)}
            className="fixed inset-0 z-10 bg-black/20 md:hidden"
          />
        )}

        <main className="min-w-0 flex-1 p-4 md:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </motion.div>
  );
}

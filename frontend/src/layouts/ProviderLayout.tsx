import type { ReactNode } from "react";

import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  useAppDispatch,
} from "../store/hooks";

import {
  clearAuth,
} from "../store/auth";

import {
  clearPersistedAuth,
} from "../store/auth/authStorage";

import {
  ROUTES,
} from "../constants/routes";
import NotificationBell from "../components/notification/NotificationBell";

interface Props {
  children: ReactNode;
}

export default function ProviderLayout({
  children,
}: Props) {
  const [expanded, setExpanded] =
    useState<boolean>(true);

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const dispatch =
    useAppDispatch();

  /* ====================================================== */
  /* NAV ITEMS */
  /* ====================================================== */

  const navItems =
    useMemo(
      () => [
        {
          id: "dashboard",

          label:
            "Dashboard",

          href:
            ROUTES
              .PROVIDER
              .DASHBOARD,

          icon:
            LayoutDashboard,
        },

        {
          id: "profile",

          label:
            "Profile",

          href:
            ROUTES
              .PROVIDER
              .PROFILE,

          icon:
            User,
        },

        {
          id: "verification",

          label:
            "Verification",

          href:
            ROUTES
              .PROVIDER
              .VERIFICATION,

          icon:
            ShieldCheck,
        },
      ],
      [],
    );

  /* ====================================================== */
  /* LOGOUT */
  /* ====================================================== */

  const handleLogout =
    async () => {
      const result =
        await Swal.fire({
          title:
            "Log out?",

          text:
            "You will be signed out of your account.",

          icon:
            "warning",

          showCancelButton:
            true,

          confirmButtonColor:
            "#111827",

          cancelButtonColor:
            "#6b7280",

          confirmButtonText:
            "Logout",
        });

      if (
        !result.isConfirmed
      ) {
        return;
      }

      clearPersistedAuth();

      dispatch(
        clearAuth(),
      );

      navigate(
        ROUTES
          .PROVIDER
          .LOGIN,
        {
          replace:
            true,
        },
      );
    };

  return (
    <motion.div className="min-h-screen flex flex-col bg-[#F5F6F8]">
      {/* Header */}

      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setExpanded(
                (
                  v,
                ) => !v,
              )
            }
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            {expanded ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter italic">
              SPENZEE
            </span>

            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
              Provider
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
            P
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}

        <aside
          className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
            expanded
              ? "w-64"
              : "w-16"
          }`}
        >
          <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
            {navItems.map(
              (
                item,
              ) => {
                const isActive =
                  location.pathname.includes(
                    item.href,
                  );

                const Icon =
                  item.icon;

                return (
                  <Link
                    key={
                      item.id
                    }
                    to={
                      item.href
                    }
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title={
                      !expanded
                        ? item.label
                        : undefined
                    }
                  >
                    <Icon
                      size={
                        18
                      }
                      className={
                        isActive
                          ? "text-white"
                          : "text-gray-500"
                      }
                    />

                    {expanded && (
                      <span className="font-medium text-sm">
                        {
                          item.label
                        }
                      </span>
                    )}
                  </Link>
                );
              },
            )}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <button
              onClick={
                handleLogout
              }
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-red-600 hover:bg-red-50"
              title={
                !expanded
                  ? "Logout"
                  : undefined
              }
            >
              <LogOut
                size={
                  18
                }
              />

              {expanded && (
                <span className="font-medium text-sm">
                  Logout
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* Main */}

        <main className="flex-1 p-8 overflow-y-auto">
          {
            children
          }
        </main>
      </div>
    </motion.div>
  );
}

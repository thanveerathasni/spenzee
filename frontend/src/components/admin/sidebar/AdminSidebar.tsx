import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, ShieldAlert,
  BarChart2, Settings, LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { authApi } from "../../../api/auth.api";
import { clearAuth } from "../../../store/auth";
import Swal from "sweetalert2";

interface Props { open: boolean; }

const NAV = [
  { label: "Dashboard",   href: "/admin/dashboard",  icon: LayoutDashboard },
  { label: "Users",       href: "/admin/users",       icon: Users },
  { label: "Providers",   href: "/admin/providers",   icon: Building2 },
  { label: "Audits",      href: "/admin/audits",      icon: ShieldAlert },
  { label: "Analytics",   href: "/admin/analytics",   icon: BarChart2 },
  { label: "Settings",    href: "/admin/settings",    icon: Settings },
];

export default function AdminSidebar({ open }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sign out?",
      showCancelButton: true,
      confirmButtonColor: "#111",
      cancelButtonColor: "#e5e7eb",
      confirmButtonText: "Sign out",
      background: "#fff",
      color: "#111",
    });
    if (!result.isConfirmed) return;
    try { await authApi.logout(); } catch {}
    finally { dispatch(clearAuth()); navigate("/admin/login", { replace: true }); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 h-full w-64 bg-[#0C0C0B] z-50 flex flex-col"
        >
          {/* Logo */}
          <div className="px-7 pt-8 pb-6 border-b border-white/[0.06]">
            <p className="text-white font-black text-lg tracking-[-0.05em] uppercase leading-none">
              Spenzee
            </p>
            <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.35em] mt-1.5">
              Admin Console
            </p>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
            {NAV.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.18em] transition-all duration-200 ${
                      isActive
                        ? "bg-white text-black"
                        : "text-white/30 hover:text-white hover:bg-white/[0.06]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon size={14} />
                        {item.label}
                      </div>
                      {isActive && (
                        <motion.div layoutId="sidebar-dot" className="w-1.5 h-1.5 rounded-full bg-black" />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-3 pb-6 border-t border-white/[0.06] pt-4">
            <motion.button
              whileHover={{ x: 3 }}
              onClick={handleLogout}
              className="group flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.18em] text-white/20 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              <LogOut size={14} />
              Sign Out
            </motion.button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

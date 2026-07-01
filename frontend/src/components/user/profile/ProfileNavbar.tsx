














import { BarChart3, Menu, Search, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../../api/auth.api";
import { clearAuth } from "../../../store/auth";
import Swal from "sweetalert2";
import { ROUTES } from "../../../constants/routes";
import { ALERT_MESSAGES } from "../../../constants/messages";
import NotificationBell from "../../notification/NotificationBell";

interface Props {
  onMenuClick: () => void;
  userName: string;
}

export default function ProfileNavbar({ onMenuClick, userName }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    {
      label: "Dashboard",
      href: ROUTES.USER.DASHBOARD,
    },
    {
      label: "Financial Insights",
      href: ROUTES.USER.FINANCIAL_INSIGHTS,
    },
    {
      label: "Profile",
      href: ROUTES.USER.PROFILE,
    },
    {
      label: "Verification",
      href: ROUTES.USER.VERIFICATION,
    },
  ];

  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: ALERT_MESSAGES.AUTH.LOGOUT_TITLE,
      text: ALERT_MESSAGES.AUTH.LOGOUT_TEXT,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: ALERT_MESSAGES.AUTH.LOGOUT_CONFIRM,
      cancelButtonText: ALERT_MESSAGES.AUTH.LOGOUT_CANCEL,
      background: "#0a0a0a",
      color: "#ffffff",
      confirmButtonColor: "#ffffff",
      cancelButtonColor: "#333333",
    });
    if (!result.isConfirmed) return;
    try { await authApi.logout(); } catch (e) { console.error(e); }
    finally {
      dispatch(clearAuth());
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="h-16 border-b border-white/10 flex items-center px-6 gap-4 bg-black backdrop-blur-xl sticky top-0 z-50"
    >
      {/* Logo + hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-white/60 hover:text-white transition p-1"
        >
          <Menu size={20} />
        </button>
        <span className="font-serif text-white text-xl tracking-tight">Spenzee</span>
      </div>

      <div className="hidden flex-1 items-center justify-center gap-1 xl:flex">
        {navItems.map((item) => {
          const isActive =
            item.href === ROUTES.USER.FINANCIAL_INSIGHTS
              ? location.pathname.startsWith(item.href)
              : location.pathname === item.href;

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => navigate(item.href)}
              className={`rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest transition ${
                isActive
                  ? "bg-white text-black"
                  : "text-white/45 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="hidden flex-1 justify-center md:flex xl:hidden">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-72 hover:border-white/20 transition">
          <Search size={14} className="text-white/40" />
          <input
            className="bg-transparent outline-none text-sm w-full text-white placeholder-white/30"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(ROUTES.USER.FINANCIAL_INSIGHTS)}
          className="hidden items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white/50 transition hover:bg-white/5 hover:text-white md:inline-flex xl:hidden"
        >
          <BarChart3 size={14} />
          Financial Insights
        </button>
        <NotificationBell tone="dark" />

        {/* Logout button in navbar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-widest transition"
        >
          <LogOut size={15} />
          <span className="hidden md:inline"></span>
        </motion.button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
      </div>
    </motion.nav>
  );
}
















import { Bell, Menu, Search, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api/auth.api";
import { clearAuth } from "../../../store/auth";
import Swal from "sweetalert2";
import { ROUTES } from "../../../constants/routes";
import { ALERT_MESSAGES } from "../../../constants/messages";

interface Props {
  onMenuClick: () => void;
  userName: string;
}

export default function ProfileNavbar({ onMenuClick, userName }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

      {/* Search */}
      <div className="flex-1 flex justify-center">
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
        <button className="relative text-white/50 hover:text-white transition">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
        </button>

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

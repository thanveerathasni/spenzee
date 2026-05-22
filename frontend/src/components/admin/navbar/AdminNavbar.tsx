
import { Menu, Bell, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api/auth.api";
import { clearAuth } from "../../../store/auth";
import Swal from "sweetalert2";

interface Props {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "AD";

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sign out?",
      text: "You will be redirected to login.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#111",
      cancelButtonColor: "#e5e7eb",
      confirmButtonText: "Sign out",
      background: "#fff",
      color: "#111",
    });
    if (!result.isConfirmed) return;
    try { await authApi.logout(); } catch {
      console.log("Logout API failed, clearing local session");
    }
    finally { dispatch(clearAuth()); navigate("/admin/login", { replace: true }); }
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 left-0 lg:left-64 z-40 flex items-center justify-between px-6 md:px-10 h-16 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] transition-all duration-500"
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors"
        >
          <Menu size={18} />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2.5 bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-2 w-64 group focus-within:border-black/20 transition-colors">
          <Search size={13} className="text-black/30 group-focus-within:text-black/60 transition-colors" />
          <input
            placeholder="Search anything..."
            className="bg-transparent text-sm text-black placeholder-black/25 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="relative w-9 h-9 flex items-center justify-center border border-black/[0.08] rounded-xl bg-white text-black/40 hover:text-black hover:border-black/20 transition-all"
        >
          <Bell size={15} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full" />
        </motion.button>

        {/* Divider */}
        <div className="w-px h-5 bg-black/10" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black uppercase tracking-widest text-black leading-none">{user?.name ?? "Admin"}</p>
            <p className="text-[9px] text-black/30 tracking-widest uppercase mt-0.5">Administrator</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center text-[10px] font-black tracking-wide"
          >
            {initials}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}


import {
  User as UserIcon,
  MapPin,
  Settings,
  FileText,
  Upload,
  Shield,
  CreditCard,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "../../../types/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api/auth.api";
import { clearAuth } from "../../../store/auth";
import Swal from "sweetalert2";
import { ROUTES } from "../../../constants/routes";
import { ALERT_MESSAGES } from "../../../constants/messages";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  active: string;
  setActive: (id: string) => void;
  user?: User;
  open: boolean;
}

const NAV: NavItem[] = [
  { id: "overview",     label: "Overview",          icon: <UserIcon size={15} /> },
  { id: "edit-profile", label: "Edit Profile",       icon: <UserIcon size={15} /> },
  { id: "address",      label: "Address",            icon: <MapPin size={15} /> },
  { id: "settings",     label: "Settings",           icon: <Settings size={15} /> },
  { id: "statements",   label: "My Statements",      icon: <FileText size={15} /> },
  { id: "upload",       label: "Upload Statement",   icon: <Upload size={15} /> },
  { id: "security",     label: "Security",           icon: <Shield size={15} /> },
  { id: "billing",      label: "Billing",            icon: <CreditCard size={15} /> },
];

export default function ProfileSidebar({ active, setActive, user, open }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <AnimatePresence>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          translateX: open ? 0 : undefined,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed md:static top-0 left-0 h-full w-72 bg-black backdrop-blur-xl border-r border-white/10 z-40 flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* User info */}
        <div className="p-6 border-b border-white/10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: "backOut" }}
            className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20"
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white text-black flex items-center justify-center text-2xl font-bold">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-3 font-medium text-white text-sm"
          >
            {user?.name ?? "User"}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-white/40 mt-0.5 truncate w-full"
          >
            {user?.email ?? ""}
          </motion.p>

          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-3 text-[10px] px-3 py-1 border border-white/20 rounded-full text-white/50 tracking-widest uppercase"
          >
            Premium Member
          </motion.span>
        </div>

        {/* Nav items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item, i) => {
            const isActive = active === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4 }}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                  ${isActive
                    ? "bg-white text-black font-medium shadow-lg"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
              >
                {item.icon}
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-black"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Logout at bottom of sidebar */}
        <div className="p-3 border-t border-white/10">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={15} />
            Logout
          </motion.button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux"; 

import { sidebarConfig } from "../nav.config";
import type { AdminSection } from "../nav.config";
import { clearAuth } from "../../../store/auth/auth.slice"; 
import { api } from "../../../api/axios"; 

interface SidebarProps {
  isExpanded: boolean;
  activeSection: AdminSection;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeSection,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const items = sidebarConfig[activeSection] ?? [];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Admin session will be terminated",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: "#000",
    });

    if (!result.isConfirmed) return;

    try {
      await api.post("/admin/auth/logout");
    } catch {
      console.log("Logout API failed");
    }

    dispatch(clearAuth());
    localStorage.removeItem("auth");

    navigate("/admin/login", { replace: true });
  };

  const sidebarContent = (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      exit={{ x: -260 }}
      transition={{ ease: "easeOut", duration: 0.3 }}
      className="w-64 h-full bg-white border-r flex flex-col"
    >
      <div className="h-16 flex items-center px-6 font-bold text-xl">
        Spenzee
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="m-3 flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
      >
        <LogOut size={18} />
        Logout
      </button>
    </motion.aside>
  );

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:flex h-full">{sidebarContent}</div>

      {/* MOBILE */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={onCloseMobile}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <div className="fixed inset-y-0 left-0 z-50">
              {sidebarContent}
              <button
                onClick={onCloseMobile}
                className="absolute top-4 right-4 text-gray-500"
              >
                <X />
              </button>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
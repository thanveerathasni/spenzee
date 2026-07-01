import React from "react";
import { Search, Settings, HelpCircle, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { clearAuth } from "../../../store/auth/auth.slice"; 
import { api } from "../../../api/axios"; 
import type { AdminSection } from "../nav.config";
import NotificationBell from "../../notification/NotificationBell";

interface HeaderProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onMobileMenuOpen?: () => void; 
}

const sections: { label: string; value: AdminSection }[] = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Users", value: "users" },
  { label: "Finance", value: "finance" },
  { label: "Security", value: "security" },
];

const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSectionChange,
  onMobileMenuOpen,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

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

  return (
    <header className="h-16 w-full bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {onMobileMenuOpen && (
          <button
            onClick={onMobileMenuOpen}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            ☰
          </button>
        )}

        <nav className="hidden md:flex items-center gap-6">
          {sections.map((s) => (
            <button
              key={s.value}
              onClick={() => onSectionChange(s.value)}
              className={`text-sm font-medium transition ${
                activeSection === s.value
                  ? "text-black"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {s.label.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      {/* CENTER */}
      <div className="hidden lg:flex flex-1 justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search admin data..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <HeaderIcon icon={<HelpCircle size={16} />} />
        <HeaderIcon icon={<Settings size={16} />} />
        <NotificationBell audience="admin" />

        <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/admin/profile")}
          className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-gray-100"
        >
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
            AD
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium leading-none">Admin</p>
            <p className="text-[10px] text-gray-500">Super Admin</p>
          </div>
        </motion.button>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

const HeaderIcon: React.FC<{
  icon: React.ReactNode;
  badge?: boolean;
}> = ({ icon, badge }) => (
  <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
    {icon}
    {badge && (
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
    )}
  </button>
);

export default Header;

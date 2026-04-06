import {
  User as UserIcon, 
  MapPin,
  Settings,
  FileText,
  Upload,
  Shield,
  CreditCard,
} from "lucide-react";

import { User } from "../../../types/user"; 

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
  { id: "overview", label: "Overview", icon: <UserIcon size={16} /> },
  { id: "edit-profile", label: "Edit Profile", icon: <UserIcon size={16} /> },
  { id: "address", label: "Address", icon: <MapPin size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
  { id: "statements", label: "My Statements", icon: <FileText size={16} /> },
  { id: "upload", label: "Upload Statement", icon: <Upload size={16} /> },
  { id: "security", label: "Security", icon: <Shield size={16} /> },
  { id: "billing", label: "Billing", icon: <CreditCard size={16} /> },
];

export default function ProfileSidebar({
  active,
  setActive,
  user,
  open,
}: Props) {
  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-72 bg-white z-40 transition-transform
      ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* USER PROFILE */}
      <div className="p-6 border-b flex flex-col items-center text-center">

        {/*  AVATAR */}
        <div className="w-16 h-16 rounded-full overflow-hidden">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black text-white flex items-center justify-center">
              {user?.name?.[0] ?? "U"}
            </div>
          )}
        </div>

        {/* NAME */}
        <p className="mt-3 font-semibold text-gray-900">
          {user?.name ?? "User"}
        </p>

        {/* EMAIL */}
        <p className="text-sm text-gray-500">
          {user?.email ?? ""}
        </p>

        {/* BADGE */}
        <span className="mt-3 text-xs px-3 py-1 border rounded-full text-gray-700">
          PREMIUM MEMBER
        </span>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-black text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}


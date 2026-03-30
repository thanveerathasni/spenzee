import { motion } from "framer-motion";
import { User, Edit3, MapPin, Lock, Mail } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview", icon: User },
  { id: "edit", label: "Edit Profile", icon: Edit3 },
  { id: "address", label: "Address", icon: MapPin },
  { id: "password", label: "Password", icon: Lock },
  { id: "email", label: "Email", icon: Mail },
];

export default function ProfileSidebar({ activeTab, setActiveTab }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="w-80 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-serif">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 p-3 rounded ${
              activeTab === item.id ? "bg-black text-white" : ""
            }`}
          >
            <Icon size={18} />
            {item.label}
          </motion.button>
        );
      })}
    </div>
  );
}
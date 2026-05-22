



import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin/adminAxios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Swal from "sweetalert2";
import { ShieldOff, ShieldCheck } from "lucide-react";

interface User { _id: string; name: string; email: string; role: string; isActive: boolean; }

const easeOutQuart = [0.22, 1, 0.36, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutQuart } },
};

export default function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await adminApi.get(`/admin/users/${id}`);
      setUser(res.data.data);
    } catch { toast.error("Failed to load user"); }
  };

  useEffect(() => { fetchUser(); }, [id]);

  const toggleStatus = async () => {
    if (!user) return;
    const result = await Swal.fire({
      title: user.isActive ? "Block user?" : "Unblock user?",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: user.isActive ? "#ef4444" : "#22c55e",
      confirmButtonText: user.isActive ? "Block" : "Unblock",
      background: "#fff", color: "#111",
    });
    if (!result.isConfirmed) return;
    try {
      await adminApi.patch(`/admin/users/${user._id}/status`, { isActive: !user.isActive });
      toast.success("Status updated");
      fetchUser();
    } catch { toast.error("Failed"); }
  };

  if (!user) return (
    <div className="py-20 flex items-center justify-center">
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
        className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Loading...</motion.div>
    </div>
  );

  return (
    <motion.div
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      initial="hidden" animate="visible"
      className="space-y-6 max-w-3xl"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/25 mb-2">User Profile</p>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-black uppercase leading-none">{user.name}</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={toggleStatus}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            user.isActive
              ? "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100"
              : "bg-green-50 text-green-600 border border-green-100 hover:bg-green-100"
          }`}
        >
          {user.isActive ? <><ShieldOff size={12} /> Block User</> : <><ShieldCheck size={12} /> Unblock User</>}
        </motion.button>
      </motion.div>

      {/* Status */}
      <motion.div variants={item} className="flex items-center gap-3">
        <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] border ${
          user.isActive ? "border-green-100 text-green-600 bg-green-50" : "border-red-100 text-red-500 bg-red-50"
        }`}>
          {user.isActive ? "Active" : "Blocked"}
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
        <span className="text-[10px] text-black/25 font-bold uppercase tracking-widest">
          {user.role} — ID: {user._id.slice(-8)}
        </span>
      </motion.div>

      {/* Info sections */}
      {[
        {
          title: "Personal Info",
          rows: [["Name", user.name], ["Email", user.email], ["Role", user.role], ["Status", user.isActive ? "Active" : "Blocked"]]
        },
        {
          title: "Financial Info",
          rows: [["Wallet Balance", "₹12,450"], ["Total Spent", "₹58,300"], ["Transactions", "124"]]
        },
        {
          title: "Account Info",
          rows: [["Subscription", "Premium"], ["Joined", "12 Jan 2024"], ["Last Activity", "2 hours ago"]]
        },
      ].map(section => (
        <motion.div key={section.title} variants={item}
          className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-black/[0.05] bg-black/[0.02]">
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-black/25">{section.title}</p>
          </div>
          <div className="divide-y divide-black/[0.04]">
            {section.rows.map(([label, value]) => (
              <div key={label} className="px-6 py-4 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/30">{label}</span>
                <span className="text-[11px] font-black text-black uppercase tracking-wide">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

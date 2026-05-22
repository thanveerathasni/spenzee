





import { useEffect, useState } from "react";
import { adminApi } from "../../../api/admin/adminAxios";
import Badge from "../../../components/admin/common/Badge";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Search, ChevronLeft, ChevronRight, Eye, ShieldOff, ShieldCheck } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/admin/users?page=${page}&limit=10&search=${search}`);
      const data = res.data.data;
      if (Array.isArray(data)) { setUsers(data); setTotalPages(1); }
      else { setUsers(data.users || []); setTotalPages(data.totalPages || 1); }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) toast.error(error.response?.data?.message || "Failed");
      else toast.error("Failed to load users");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const result = await Swal.fire({
      title: currentStatus ? "Block user?" : "Unblock user?",
      text: currentStatus ? "User will lose access immediately" : "User will regain access",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#ef4444" : "#22c55e",
      confirmButtonText: currentStatus ? "Block" : "Unblock",
      background: "#fff", color: "#111",
    });
    if (!result.isConfirmed) return;
    try {
      await adminApi.patch(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      await Swal.fire("Done", currentStatus ? "User blocked" : "User unblocked", "success");
      fetchUsers();
    } catch { Swal.fire("Error", "Something went wrong", "error"); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="space-y-6 max-w-[1400px]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/25 mb-2">Management</p>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-black uppercase leading-none">Users</h1>
        </div>
        <div className="flex items-center gap-2.5 bg-white border border-black/[0.08] rounded-xl px-4 py-2.5 w-full md:w-72 group focus-within:border-black/20 transition-colors">
          <Search size={13} className="text-black/25 group-focus-within:text-black/50 transition-colors" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..."
            className="bg-transparent text-sm text-black placeholder-black/25 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden"
      >
        {/* Table head */}
        <div className="grid grid-cols-12 px-6 py-4 border-b border-black/[0.05] bg-black/[0.02]">
          {["Name", "Email", "Role", "Status", ""].map((h, i) => (
            <div key={i}
              className={`text-[9px] font-black uppercase tracking-[0.35em] text-black/25 ${
                i === 0 ? "col-span-3" : i === 1 ? "col-span-4" : i === 2 ? "col-span-1" : i === 3 ? "col-span-2" : "col-span-2 text-right"
              }`}
            >{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20"
            >Loading...</motion.div>
          </div>
        ) : (
          <AnimatePresence>
            {users.map((user, i) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => navigate(`/admin/users/${user._id}`)}
                className="grid grid-cols-12 px-6 py-4 border-b border-black/[0.04] hover:bg-black/[0.015] cursor-pointer transition-colors group items-center"
              >
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-black/[0.04] flex items-center justify-center text-[9px] font-black text-black/40">
                    {user.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                  </div>
                  <span className="text-[11px] font-black text-black uppercase tracking-wide truncate">{user.name}</span>
                </div>
                <div className="col-span-4 text-[11px] text-black/40 truncate">{user.email}</div>
                <div className="col-span-1 text-[9px] font-black uppercase tracking-widest text-black/30">{user.role}</div>
                <div className="col-span-2">
                  <Badge type={user.isActive ? "success" : "critical"}>
                    {user.isActive ? "Active" : "Blocked"}
                  </Badge>
                </div>
                <div className="col-span-2 flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                    className="w-7 h-7 rounded-lg border border-black/[0.08] flex items-center justify-center text-black/30 hover:text-black hover:border-black/20 transition-all"
                  ><Eye size={12} /></motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => toggleUserStatus(user._id, user.isActive)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                      user.isActive
                        ? "border-red-100 text-red-400 hover:bg-red-50"
                        : "border-green-100 text-green-500 hover:bg-green-50"
                    }`}
                  >
                    {user.isActive ? <ShieldOff size={12} /> : <ShieldCheck size={12} />}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-black/20">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="w-9 h-9 rounded-xl border border-black/[0.08] flex items-center justify-center text-black/30 hover:text-black hover:border-black/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
          ><ChevronLeft size={14} /></motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="w-9 h-9 rounded-xl border border-black/[0.08] flex items-center justify-center text-black/30 hover:text-black hover:border-black/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
          ><ChevronRight size={14} /></motion.button>
        </div>
      </div>
    </motion.div>
  );
}

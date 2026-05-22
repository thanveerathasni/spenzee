





import { useEffect, useState ,useRef} from "react";
import { adminApi } from "../../../../api/admin/adminAxios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Eye, ShieldOff } from "lucide-react";

interface Props { search: string; page: number; }
interface Provider { _id: string; brandName: string; email: string; status: string; }

export default function AdminActiveProvidersTab({ search, page }: Props) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const navigate = useNavigate();
  const prevSearchRef = useRef("");
  const prevPageRef = useRef(0);
  const fetchProviders = async () => {
    const res = await adminApi.get(`/admin/providers?status=active&search=${search}&page=${page}&limit=10`);
    setProviders(res.data.data.providers);
  };


useEffect(() => {
  if (
    prevSearchRef.current === search &&
    prevPageRef.current === page
  ) {
    return; 
  }

  prevSearchRef.current = search;
  prevPageRef.current = page;

  fetchProviders();
}, [search, page]);

  // useEffect(() => {fetchProviders(); }, [search, page]);

  const toggleStatus = async (id: string) => {
    const confirm = await Swal.fire({ title: "Suspend provider?", icon: "warning", showCancelButton: true, background: "#fff", color: "#111" });
    if (!confirm.isConfirmed) return;
    await adminApi.patch(`/admin/providers/${id}/status`, { status: "suspended" });
    toast.success("Provider suspended");
    fetchProviders();
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden">
      <div className="grid grid-cols-4 px-6 py-4 border-b border-black/[0.05] bg-black/[0.02]">
        {["Brand", "Email", "Status", ""].map((h, i) => (
          <div key={i} className={`text-[9px] font-black uppercase tracking-[0.35em] text-black/25 ${i === 3 ? "text-right" : ""}`}>{h}</div>
        ))}
      </div>
      <AnimatePresence>
        {providers.map((p, i) => (
          <motion.div key={p._id}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-4 px-6 py-4 border-b border-black/[0.04] hover:bg-black/[0.015] items-center transition-colors"
          >
            <div className="text-[11px] font-black text-black uppercase tracking-wide">{p.brandName}</div>
            <div className="text-[11px] text-black/40">{p.email}</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-black/25 border border-black/[0.08] px-2 py-1 rounded-lg w-fit">{p.status}</div>
            <div className="flex justify-end gap-1.5">
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={() => navigate(`/admin/providers/${p._id}`)}
                className="w-7 h-7 rounded-lg border border-black/[0.08] flex items-center justify-center text-black/30 hover:text-black transition-all"
              ><Eye size={11} /></motion.button>
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={() => toggleStatus(p._id)}
                className="w-7 h-7 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"
              ><ShieldOff size={11} /></motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
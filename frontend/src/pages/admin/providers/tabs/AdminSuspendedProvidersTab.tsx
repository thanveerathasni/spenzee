




import { useEffect, useState,useRef } from "react";
import { adminApi } from "../../../../api/admin/adminAxios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Eye, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props { search: string; page: number; }
interface Provider { _id: string; brandName: string; email: string; status: string; }

export default function AdminSuspendedProvidersTab({ search, page }: Props) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get(`/admin/providers?status=suspended&search=${search}&page=${page}&limit=10`);
      setProviders(res.data.data.providers);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  const prevSearchRef = useRef("");
const prevPageRef = useRef(0);

useEffect(() => {
  if (
    prevSearchRef.current === search &&
    prevPageRef.current === page
  ) {
    return;
  }

  prevSearchRef.current = search;
  prevPageRef.current = page;

  fetchData();
}, [search, page]);
  // useEffect(() => { fetchData(); }, [search, page]);

  const activate = async (id: string) => {
    const confirm = await Swal.fire({ title: "Activate provider?", icon: "warning", showCancelButton: true, background: "#fff", color: "#111" });
    if (!confirm.isConfirmed) return;
    await adminApi.patch(`/admin/providers/${id}/status`, { status: "active" });
    toast.success("Provider activated");
    fetchData();
  };

  if (loading) return (
    <div className="py-16 flex items-center justify-center">
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
        className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Loading...</motion.div>
    </div>
  );

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden">
      <div className="grid grid-cols-3 px-6 py-4 border-b border-black/[0.05] bg-black/[0.02]">
        {["Brand", "Email", ""].map((h, i) => (
          <div key={i} className={`text-[9px] font-black uppercase tracking-[0.35em] text-black/25 ${i === 2 ? "text-right" : ""}`}>{h}</div>
        ))}
      </div>
      {providers.length === 0 ? (
        <div className="py-16 text-center text-[10px] font-black uppercase tracking-[0.4em] text-black/20">No suspended providers</div>
      ) : (
        <AnimatePresence>
          {providers.map((p, i) => (
            <motion.div key={p._id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-3 px-6 py-4 border-b border-black/[0.04] hover:bg-black/[0.015] items-center transition-colors"
            >
              <div className="text-[11px] font-black text-black uppercase tracking-wide">{p.brandName}</div>
              <div className="text-[11px] text-black/40">{p.email}</div>
              <div className="flex justify-end gap-1.5">
                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                  onClick={() => navigate(`/admin/providers/${p._id}`)}
                  className="w-7 h-7 rounded-lg border border-black/[0.08] flex items-center justify-center text-black/30 hover:text-black transition-all"
                ><Eye size={11} /></motion.button>
                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                  onClick={() => activate(p._id)}
                  className="w-7 h-7 rounded-lg border border-green-100 flex items-center justify-center text-green-500 hover:bg-green-50 transition-all"
                ><ShieldCheck size={11} /></motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}

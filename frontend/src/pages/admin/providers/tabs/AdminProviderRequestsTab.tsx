






import { useEffect, useState,useRef } from "react";
import { adminApi } from "../../../../api/admin/adminAxios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle } from "lucide-react";

interface Props { search: string; page: number; }
interface Request { _id: string; brandName: string; contactEmail: string; primaryCategory: string; status: string; }

const THead = ({ cols }: { cols: string[] }) => (
  <div className={`grid px-6 py-4 border-b border-black/[0.05] bg-black/[0.02]`}
    style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}>
    {cols.map((c, i) => (
      <div key={i} className={`text-[9px] font-black uppercase tracking-[0.35em] text-black/25 ${i === cols.length - 1 ? "text-right" : ""}`}>{c}</div>
    ))}
  </div>
);

export default function AdminProviderRequestsTab({ search, page }: Props) {
  const [requests, setRequests] = useState<Request[]>([]);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await adminApi.get(`/admin/provider-requests?search=${search}&page=${page}&limit=10`);
      setRequests(res.data.data.requests || []);
    } catch { toast.error("Failed to load requests"); }
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

  fetchRequests();
}, [search, page]);

  // useEffect(() => { fetchRequests(); }, [search, page]);

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    const result = await Swal.fire({
      title: `${status === "approved" ? "Approve" : "Reject"} request?`,
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      background: "#fff", color: "#111",
      confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await adminApi.patch(`/admin/provider-requests/${id}/review`, { status });
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden">
      <THead cols={["Brand", "Email", "Category", "Status", "Actions"]} />
      <AnimatePresence>
        {requests.length === 0 ? (
          <div className="py-16 text-center text-[10px] font-black uppercase tracking-[0.4em] text-black/20">
            No requests found
          </div>
        ) : requests.map((r, i) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-5 px-6 py-4 border-b border-black/[0.04] hover:bg-black/[0.015] items-center transition-colors"
          >
            <div className="text-[11px] font-black text-black uppercase tracking-wide truncate">{r.brandName}</div>
            <div className="text-[11px] text-black/40 truncate">{r.contactEmail}</div>
            <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{r.primaryCategory}</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-black/25 border border-black/[0.08] px-2 py-1 rounded-lg w-fit">{r.status}</div>
            <div className="flex justify-end gap-1.5">
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={() => navigate(`/admin/providers/${r._id}`)}
                className="w-7 h-7 rounded-lg border border-black/[0.08] flex items-center justify-center text-black/30 hover:text-black transition-all"
              ><Eye size={11} /></motion.button>
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={() => handleReview(r._id, "approved")}
                className="w-7 h-7 rounded-lg border border-green-100 flex items-center justify-center text-green-500 hover:bg-green-50 transition-all"
              ><CheckCircle size={11} /></motion.button>
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={() => handleReview(r._id, "rejected")}
                className="w-7 h-7 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"
              ><XCircle size={11} /></motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
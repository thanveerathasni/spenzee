import { useEffect, useState } from "react";
import { adminApi } from "../../../../api/admin/adminAxios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

interface Provider {
  _id: string;
  brandName: string;
  email: string;
  status: string;
}

export default function AdminSuspendedProvidersTab() {
  const [providers, setRequests] = useState<Provider[]>([]);

const fetchRequests = async () => {
  const res = await adminApi.get(
    `/admin/provider-requests?search=${search}&page=${page}&limit=10`
  );

  setRequests(res.data.data.requests); 
};

  useEffect(() => {
    fetchRequests();
  }, []);

  const activate = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Activate provider?",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await adminApi.patch(`/admin/providers/${id}/status`, {
      status: "active",
    });

    toast.success("Activated");
    fetchRequests();
  };

  return (
    <motion.div className="bg-white rounded-2xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4">Brand</th>
            <th className="p-4">Email</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {providers.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-4">{p.brandName}</td>
              <td className="p-4">{p.email}</td>

              <td className="p-4">
                <button
                  onClick={() => activate(p._id)}
                  className="px-3 py-1 bg-green-50 text-green-600 rounded-md"
                >
                  Activate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
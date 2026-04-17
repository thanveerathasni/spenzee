import { useEffect, useState } from "react";
import { adminApi } from "../../../../api/admin/adminAxios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


interface Props {
  search: string;
  page: number;
}

interface Provider {
  _id: string;
  brandName: string;
  email: string;
  status: string;
}

export default function AdminActiveProvidersTab({ search, page }: Props) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const navigate = useNavigate();

  const fetchProviders = async () => {
    const res = await adminApi.get(
      `/admin/providers?status=active&search=${search}&page=${page}&limit=10`
    );

    setProviders(res.data.data.providers);
  };

  

  useEffect(() => {
    fetchProviders();
  }, [search, page]);

  const toggleStatus = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Suspend provider?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await adminApi.patch(`/admin/providers/${id}/status`, {
      status: "suspended",
    });

    toast.success("Provider suspended");
    fetchProviders();
  };

  return (
    <motion.div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b text-gray-500">
          <tr>
            <th className="p-4">Brand</th>
            <th className="p-4">Email</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {providers.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="p-4 font-medium">{p.brandName}</td>
              <td className="p-4 text-gray-500">{p.email}</td>
              <td className="p-4 capitalize">{p.status}</td>

              <td className="p-4 text-right space-x-2">
                <button
                  onClick={() => navigate(`/admin/providers/${p._id}`)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs"
                >
                  View
                </button>

                <button
                  onClick={() => toggleStatus(p._id)}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs"
                >
                  Suspend
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
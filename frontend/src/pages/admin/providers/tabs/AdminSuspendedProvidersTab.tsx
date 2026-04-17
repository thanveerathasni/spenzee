import { useEffect, useState } from "react";
import { adminApi } from "../../../../api/admin/adminAxios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

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

export default function AdminSuspendedProvidersTab({ search, page }: Props) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);

      const res = await adminApi.get(
        `/admin/providers?status=suspended&search=${search}&page=${page}&limit=10`
      );

      setProviders(res.data.data.providers);
    } catch {
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [search, page]);

  const activate = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Activate provider?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await adminApi.patch(`/admin/providers/${id}/status`, {
      status: "active",
    });

    toast.success("Provider activated");
    fetch();
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <motion.div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b text-gray-500">
          <tr>
            <th className="p-4">Brand</th>
            <th className="p-4">Email</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {providers.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="p-4 font-medium">{p.brandName}</td>
              <td className="p-4 text-gray-500">{p.email}</td>

              <td className="p-4 text-right">
                <button
                  onClick={() => activate(p._id)}
                  className="px-3 py-1 bg-green-50 text-green-600 rounded-md text-xs"
                >
                  Activate
                </button>
              </td>
            </tr>
          ))}

          {providers.length === 0 && (
            <tr>
              <td colSpan={3} className="p-6 text-center text-gray-500">
                No suspended providers
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
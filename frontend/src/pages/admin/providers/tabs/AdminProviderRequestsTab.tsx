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

interface Request {
  _id: string;
  brandName: string;
  contactEmail: string;
  primaryCategory: string;
  status: string;
}

export default function AdminProviderRequestsTab({ search, page }: Props) {
  const [requests, setRequests] = useState<Request[]>([]);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await adminApi.get(
        `/admin/provider-requests?search=${search}&page=${page}&limit=10`
      );

      setRequests(res.data.data.requests || []);
    } catch (err) {
      console.error("Fetch requests error:", err);
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [search, page]);

  const handleReview = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    const result = await Swal.fire({
      title: `${status === "approved" ? "Approve" : "Reject"} request?`,
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      await adminApi.patch(`/admin/provider-requests/${id}/review`, {
        status,
      });

      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update request");
    }
  };

  return (
    <motion.div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b text-gray-500">
          <tr>
            <th className="p-4">Brand</th>
            <th className="p-4">Email</th>
            <th className="p-4">Category</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {requests.length > 0 ? (
            requests.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{r.brandName}</td>
                <td className="p-4 text-gray-500">{r.contactEmail}</td>
                <td className="p-4">{r.primaryCategory}</td>
                <td className="p-4 capitalize">{r.status}</td>

                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => navigate(`/admin/providers/${r._id}`)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleReview(r._id, "approved")}
                    className="px-3 py-1 bg-green-50 text-green-600 rounded-md text-xs"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReview(r._id, "rejected")}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                No provider requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
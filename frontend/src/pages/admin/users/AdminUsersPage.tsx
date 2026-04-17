import { useEffect, useState } from "react";
import { adminApi } from "../../../api/admin/adminAxios";
import Badge from "../../../components/admin/common/Badge";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

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
    const res = await adminApi.get(
      `/admin/users?page=${page}&limit=10&search=${search}`
    );

    const data = res.data.data;

    if (Array.isArray(data)) {
      setUsers(data);
      setTotalPages(1);
    } else {
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    }

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } else {
      toast.error("Failed to load users");
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const result = await Swal.fire({
      title: currentStatus ? "Block user?" : "Unblock user?",
      text: currentStatus
        ? "User will lose access immediately"
        : "User will regain access",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#ef4444" : "#22c55e",
      confirmButtonText: currentStatus ? "Block" : "Unblock",
    });

    if (!result.isConfirmed) return;

    try {
      await adminApi.patch(`/admin/users/${userId}/status`, {
        isActive: !currentStatus,
      });

      await Swal.fire(
        "Success",
        currentStatus ? "User blocked" : "User unblocked",
        "success"
      );

      fetchUsers();
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          User Management
        </h1>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search users..."
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading users...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-sm text-gray-500">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y text-sm">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/users/${user._id}`)}
                >
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4 capitalize">{user.role}</td>
                  <td className="p-4">
                    <Badge type={user.isActive ? "success" : "critical"}>
                      {user.isActive ? "Active" : "Blocked"}
                    </Badge>
                  </td>

                  <td
                    className="p-4 flex justify-end gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        navigate(`/admin/users/${user._id}`)
                      }
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-md"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        toggleUserStatus(user._id, user.isActive)
                      }
                      className={`px-3 py-1 text-xs rounded-md ${
                        user.isActive
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {user.isActive ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
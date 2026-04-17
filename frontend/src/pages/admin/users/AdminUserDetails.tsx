import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin/adminAxios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Swal from "sweetalert2";


interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await adminApi.get(`/admin/users/${id}`);
      setUser(res.data.data);
    } catch {
      toast.error("Failed to load user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const toggleStatus = async () => {
    if (!user) return;

    const result = await Swal.fire({
      title: user.isActive ? "Block user?" : "Unblock user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: user.isActive ? "#ef4444" : "#22c55e",
      confirmButtonText: user.isActive ? "Block" : "Unblock",
    });

    if (!result.isConfirmed) return;

    try {
      await adminApi.patch(`/admin/users/${user._id}/status`, {
        isActive: !user.isActive,
      });

      toast.success("Status updated");
      fetchUser();
    } catch {
      toast.error("Failed");
    }
  };

  

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold text-gray-900">
        User Details
      </h1>

      {/* PERSONAL */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="font-semibold mb-3">Personal Info</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p>
          <strong>Status:</strong>{" "}
          {user.isActive ? "Active" : "Blocked"}
        </p>
      </div>

      {/* FINANCIAL (FAKE) */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="font-semibold mb-3">Financial Info</h2>
        <p><strong>Wallet Balance:</strong> ₹12,450</p>
        <p><strong>Total Spent:</strong> ₹58,300</p>
        <p><strong>Transactions:</strong> 124</p>
      </div>

      {/* COMMERCIAL (FAKE) */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="font-semibold mb-3">Commercial Info</h2>
        <p><strong>Subscription:</strong> Premium</p>
        <p><strong>Joined:</strong> 12 Jan 2024</p>
        <p><strong>Last Activity:</strong> 2 hours ago</p>
      </div>

      {/* ACTION */}
      <div>
        <button
          onClick={toggleStatus}
          className={`px-4 py-2 rounded-xl text-white ${
            user.isActive ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {user.isActive ? "Block User" : "Unblock User"}
        </button>
      </div>
    </motion.div>
  );
}
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { adminAuthApi } from "../../../api/admin/adminAuth.api";
// import { adminAuthStore } from "../../../store/admin/adminAuth";
// import toast from "react-hot-toast";

// interface DashboardData {
//   adminId: string;
//   stats: {
//     users: number;
//     revenue: number;
//     alerts: number;
//   };
// }

// const AdminDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState<DashboardData | null>(null);

//   useEffect(() => {
//     const token = adminAuthStore.getToken();

//     if (!token) {
//       navigate("/admin/login");
//       return;
//     }

//     adminAuthApi
//       .getDashboard(token)
//       .then(setData)
//       .catch(() => {
//         toast.error("Session expired");
//         adminAuthStore.clear();
//         navigate("/admin/login");
//       });
//   }, [navigate]);

//   if (!data) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-black text-white">
//         Loading dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white p-10">
//       <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

//       <div className="grid grid-cols-3 gap-6">
//         <div className="bg-zinc-900 p-6 rounded-xl">
//           <p className="text-gray-400">Users</p>
//           <h2 className="text-3xl font-bold">{data.stats.users}</h2>
//         </div>

//         <div className="bg-zinc-900 p-6 rounded-xl">
//           <p className="text-gray-400">Revenue</p>
//           <h2 className="text-3xl font-bold">₹{data.stats.revenue}</h2>
//         </div>

//         <div className="bg-zinc-900 p-6 rounded-xl">
//           <p className="text-gray-400">Alerts</p>
//           <h2 className="text-3xl font-bold">{data.stats.alerts}</h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
// src/pages/admin/dashboard/Dashboard.tsx
import { motion } from 'framer-motion'

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-3xl font-bold mt-1">24,812</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Active Providers</p>
          <p className="text-3xl font-bold mt-1">1,204</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="text-3xl font-bold mt-1">$142,500</p>
        </div>
      </div>

      {/* Add charts, alerts, recent activity here */}
      <div className="bg-white p-6 rounded-xl shadow min-h-[300px]">
        Content / charts coming soon
      </div>
    </motion.div>
  )
}
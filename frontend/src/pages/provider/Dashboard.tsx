import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DollarSign, Star, Users, CalendarDays, TrendingUp } from "lucide-react";

export default function ProviderDashboard() {
  const stats = [
    { title: "Total Revenue", value: "$12,450", icon: DollarSign, change: "+14.5%", positive: true },
    { title: "Bookings", value: "156", icon: CalendarDays, change: "+5.2%", positive: true },
    { title: "Active Clients", value: "84", icon: Users, change: "-2.1%", positive: false },
    { title: "Rating", value: "4.8", icon: Star, change: "0.0%", positive: true },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your business today.</p>
        </div>
        <Link 
          to="/provider/profile" 
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition"
        >
          Manage Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
                  <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                }`}>
                  <TrendingUp size={12} className={!stat.positive ? "rotate-180" : ""} />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <CalendarDays size={48} className="mb-4 opacity-20" />
            <p>No recent bookings to display.</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Schedule</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-100/50 bg-gray-50/50">
              <p className="text-sm font-medium text-gray-900">Plumbing Service</p>
              <p className="text-xs text-gray-500 mt-1">Today at 2:00 PM</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100/50 bg-gray-50/50">
              <p className="text-sm font-medium text-gray-900">Home Inspection</p>
              <p className="text-xs text-gray-500 mt-1">Tomorrow at 10:00 AM</p>
            </div>
          </div>
          <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            View Calendar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

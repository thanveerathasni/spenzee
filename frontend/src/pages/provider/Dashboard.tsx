import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertCircle, Clock, DollarSign, Package, CalendarDays, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { providerProfileApi, type ProviderDashboardStats } from "../../api/provider/providerProfile.api";
import type { AdminProvider } from "../../types/provider";

export default function ProviderDashboard() {
  const [stats, setStats] =
    useState<ProviderDashboardStats | null>(null);
  const [commerce, setCommerce] =
    useState<AdminProvider | null>(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const commerceStatus =
          await providerProfileApi.getCommerceStatus();

        setCommerce(commerceStatus);

        if (
          commerceStatus.commerceStatus === "APPROVED" &&
          commerceStatus.commerceEnabled &&
          !commerceStatus.isCommerceFrozen
        ) {
          setStats(await providerProfileApi.getDashboard());
        }
      } catch {
        toast.error("Failed to load provider dashboard");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const commerceBlocked =
    commerce &&
    (
      commerce.commerceStatus !== "APPROVED" ||
      !commerce.commerceEnabled ||
      commerce.isCommerceFrozen
    );

  const dashboardStats = [
    {
      title: "Total Revenue",
      value: `₹${(stats?.revenue ?? 0).toLocaleString("en-IN")}`,
      icon: DollarSign,
      change: "Live",
      positive: true,
    },
    {
      title: "Total Sales",
      value: String(stats?.totalSales ?? 0),
      icon: CalendarDays,
      change: "API",
      positive: true,
    },
    {
      title: "Products",
      value: String(stats?.totalProducts ?? 0),
      icon: Package,
      change: "Synced",
      positive: true,
    },
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

      {commerceBlocked && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700">
                {commerce.commerceStatus === "REJECTED" || commerce.commerceStatus === "FROZEN" ? (
                  <AlertCircle size={22} />
                ) : (
                  <Clock size={22} />
                )}
              </div>
              <div>
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  {commerce.commerceStatus}
                </span>
                <h2 className="mt-3 text-xl font-bold text-gray-900">
                  {commerce.commerceStatus === "REJECTED"
                    ? "Commerce approval was rejected"
                    : commerce.commerceStatus === "FROZEN"
                      ? "Commerce access is frozen"
                      : "Waiting for Commerce Approval"}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  {commerce.commerceStatus === "REJECTED"
                    ? commerce.commerceRejectedReason || "Please contact support for the next review steps."
                    : commerce.commerceStatus === "FROZEN"
                      ? "Your products remain saved, but selling access is temporarily disabled."
                      : "Your documents can be verified while commerce approval is still pending. Admin approval is required before selling products."}
                </p>
              </div>
            </div>
            <Link
              to="/provider/support"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      )}

      {commerceBlocked ? null : (
      <>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardStats.map((stat, i) => {
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
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? "..." : stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <CalendarDays size={48} className="mb-4 opacity-20" />
            <p>No recent backend activity to display.</p>
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
      </>
      )}
    </motion.div>
  );
}

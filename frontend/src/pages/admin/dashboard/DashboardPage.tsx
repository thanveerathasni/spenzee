import React from "react";
import { motion } from "framer-motion";
import { Filter, Download, ExternalLink } from "lucide-react";

import StatCard from "../../../components/admin/cards/StatCard";
import RevenueChart from "../../../components/admin/charts/RevenueChart";
import StatusDonut from "../../../components/admin/charts/StatusDonut";
import Badge from "../../../components/admin/common/Badge";
import { SEVERITY } from "../../../types/admin/dashboard.types";
import  type { Severity } from "../../../types/admin/dashboard.types";

/* ---------------- Mock Data (will move to Redux later) ---------------- */

const revenueData = [
  { name: "Jan", value: 42000 },
  { name: "Feb", value: 38000 },
  { name: "Mar", value: 52000 },
  { name: "Apr", value: 48000 },
  { name: "May", value: 61000 },
  { name: "Jun", value: 58000 },
  { name: "Jul", value: 72000 },
];

const statusData = [
  { name: "Approved", value: 65, color: "#111827" },
  { name: "Pending", value: 25, color: "#6B7280" },
  { name: "Suspended", value: 10, color: "#E5E7EB" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

/* ---------------- Page ---------------- */

const DashboardPage: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Welcome back, John. Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value="$1,284,500"
          trend={12.5}
          trendDirection="up"
          description="Compared to $1,141,700 last month"
        />
        <StatCard
          label="Active Users"
          value="48,294"
          trend={8.2}
          trendDirection="up"
          description="3,410 new registrations today"
        />
        <StatCard
          label="Providers"
          value="1,402"
          trend={2.4}
          trendDirection="down"
          description="Churn rate increased by 0.5%"
        />
        <StatCard
          label="Pending Audits"
          value="24"
          trend={5.0}
          trendDirection="up"
          description="Requires immediate attention"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-semibold text-gray-900">
              Revenue Performance
            </h4>
            <select className="text-xs bg-gray-50 border-none focus:ring-0 rounded-md py-1 px-2 cursor-pointer">
              <option>Last 7 months</option>
              <option>Last year</option>
            </select>
          </div>

          <RevenueChart data={revenueData} />
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          <h4 className="font-semibold text-gray-900 mb-8">
            Provider Status
          </h4>
          <StatusDonut data={statusData} totalLabel="Total" />

          <div className="space-y-3 mt-4">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-500">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-semibold">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {/* Needs Attention */}
        <motion.div
          variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
          className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">
              Needs Attention
            </h4>
            <button className="text-xs text-gray-400 hover:text-gray-900 font-medium flex items-center gap-1 transition-colors">
              View all <ExternalLink size={12} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {[
              {
                id: "1",
                title: "KYC Verification Failed",
                desc: "User ID #4928 failed liveness check",
                severity: SEVERITY.CRITICAL,
                time: "2m ago",
              },
              {
                id: "2",
                title: "High Volume Transaction",
                desc: "Transfer of $50k+ detected",
                severity: SEVERITY.HIGH,
                time: "15m ago",
              },
              {
                id: "3",
                title: "Provider Service Down",
                desc: "AWS us-east-1 timeout",
                severity: SEVERITY.CRITICAL,
                time: "24m ago",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <Badge type={item.severity}>
                        {item.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
          className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-50">
            <h4 className="font-semibold text-gray-900">
              Live Activity Feed
            </h4>
          </div>

          <div className="divide-y divide-gray-50">
            {[
              {
                id: "1",
                user: "Sarah Miller",
                action: "initiated a withdrawal",
                amount: "$420.00",
                status: "pending",
                time: "Just now",
              },
              {
                id: "2",
                user: "Apex Global",
                action: "updated provider rates",
                status: "success",
                time: "5m ago",
              },
            ].map((activity) => (
              <div
                key={activity.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-900">
                        {activity.user}
                      </span>{" "}
                      {activity.action}
                      {activity.amount && (
                        <span className="text-gray-900 font-medium">
                          {" "}
                          {activity.amount}
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>

                <Badge type={activity.status as any}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;

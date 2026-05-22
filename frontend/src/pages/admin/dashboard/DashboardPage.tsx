import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Filter, Download, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import RevenueChart from "../../../components/admin/charts/RevenueChart";
import StatusDonut from "../../../components/admin/charts/StatusDonut";
import Badge from "../../../components/admin/common/Badge";
import { SEVERITY } from "../../../types/admin/dashboard.types";

const revenueData = [
  { name: "Jan", value: 42000 },
  { name: "Feb", value: 38000 },
  { name: "Mar", value: 52000 },
  { name: "Apr", value: 48000 },
  { name: "May", value: 61000 },
  { name: "Jun", value: 58000 },
  { name: "Jul", value: 72000 },
];

type ActivityStatus = "pending" | "success";

const statusData = [
  { name: "Approved", value: 65, color: "#111827" },
  { name: "Pending",  value: 25, color: "#6B7280" },
  { name: "Suspended",value: 10, color: "#E5E7EB" },
];

const easeOutQuart = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOutQuart } },
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <motion.div
    variants={item}
    className={`bg-white border border-black/[0.06] rounded-2xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const DashboardPage: React.FC = () => (
  <motion.div variants={container} initial="hidden" animate="visible" className="space-y-8 max-w-[1400px]">

    {/* Header */}
    <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/25 mb-2">
          Overview
        </p>
        <h1 className="text-3xl font-black tracking-[-0.04em] text-black uppercase leading-none">
          Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 border border-black/[0.08] rounded-xl text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black hover:border-black/20 transition-all bg-white"
        >
          <Filter size={13} /> Filter
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all"
        >
          <Download size={13} /> Export
        </motion.button>
      </div>
    </motion.div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Total Revenue",   value: "$1,284,500", trend: 12.5, up: true,  sub: "vs $1,141,700 last month" },
        { label: "Active Users",    value: "48,294",     trend: 8.2,  up: true,  sub: "3,410 new today" },
        { label: "Providers",       value: "1,402",      trend: 2.4,  up: false, sub: "Churn +0.5%" },
        { label: "Pending Audits",  value: "24",         trend: 5.0,  up: false, sub: "Requires attention" },
      ].map((k) => (
        <motion.div
          key={k.label}
          variants={item}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-black/[0.06] rounded-2xl p-6"
        >
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-black/25 mb-4">{k.label}</p>
          <p className="text-3xl font-black tracking-tight text-black leading-none mb-3">{k.value}</p>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${k.up ? "bg-black/[0.04] text-black" : "bg-black/[0.04] text-black/40"}`}>
              {k.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {k.trend}%
            </div>
            <p className="text-[10px] text-black/25">{k.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-black/25 mb-1">Performance</p>
            <h4 className="font-black text-black uppercase tracking-tight text-base">Revenue Chart</h4>
          </div>
          <select className="text-[10px] font-black uppercase tracking-widest bg-black/[0.03] border border-black/[0.06] rounded-xl py-1.5 px-3 focus:outline-none text-black/50">
            <option>Last 7 months</option>
            <option>Last year</option>
          </select>
        </div>
        <RevenueChart data={revenueData} />
      </Card>

      <Card className="p-6">
        <div className="mb-8">
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-black/25 mb-1">Breakdown</p>
          <h4 className="font-black text-black uppercase tracking-tight text-base">Provider Status</h4>
        </div>
        <StatusDonut data={statusData} totalLabel="Total" />
        <div className="space-y-3 mt-6">
          {statusData.map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{s.name}</span>
              </div>
              <span className="text-[11px] font-black text-black">{s.value}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Bottom lists */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">

      {/* Needs Attention */}
      <Card>
        <div className="px-6 py-5 border-b border-black/[0.05] flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-black/25 mb-0.5">Alerts</p>
            <h4 className="font-black text-black uppercase tracking-tight text-sm">Needs Attention</h4>
          </div>
          <button className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-black/25 hover:text-black transition-colors">
            View all <ExternalLink size={10} />
          </button>
        </div>
        <div className="divide-y divide-black/[0.04]">
          {[
            { id: "1", title: "KYC Verification Failed", desc: "User ID #4928 failed liveness check", severity: SEVERITY.CRITICAL, time: "2m ago" },
            { id: "2", title: "High Volume Transaction",  desc: "Transfer of $50k+ detected",          severity: SEVERITY.HIGH,     time: "15m ago" },
            { id: "3", title: "Provider Service Down",   desc: "AWS us-east-1 timeout",               severity: SEVERITY.CRITICAL, time: "24m ago" },
          ].map((a) => (
            <motion.div
              key={a.id}
              whileHover={{ backgroundColor: "#fafafa" }}
              className="px-6 py-4 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[11px] font-black uppercase tracking-wide text-black">{a.title}</p>
                    <Badge type={a.severity}>{a.severity}</Badge>
                  </div>
                  <p className="text-[10px] text-black/30">{a.desc}</p>
                </div>
                <span className="text-[9px] text-black/25 font-bold uppercase tracking-widest shrink-0">{a.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Activity Feed */}
      <Card>
        <div className="px-6 py-5 border-b border-black/[0.05]">
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-black/25 mb-0.5">Live</p>
          <h4 className="font-black text-black uppercase tracking-tight text-sm">Activity Feed</h4>
        </div>
        <div className="divide-y divide-black/[0.04]">
          {[
            { id: "1", user: "Sarah Miller", action: "initiated a withdrawal", amount: "$420.00", status: "pending", time: "Just now" },
            { id: "2", user: "Apex Global",  action: "updated provider rates",  status: "success",  time: "5m ago" },
          ].map((a) => (
            <motion.div
              key={a.id}
              whileHover={{ backgroundColor: "#fafafa" }}
              className="px-6 py-4 flex items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-black/[0.04] flex items-center justify-center text-[9px] font-black text-black/40">
                  {a.user.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-[10px] text-black/40">
                    <span className="font-black text-black">{a.user}</span> {a.action}
                    {a.amount && <span className="font-black text-black"> {a.amount}</span>}
                  </p>
                  <p className="text-[9px] text-black/20 mt-0.5 uppercase tracking-widest font-bold">{a.time}</p>
                </div>
              </div>
              <Badge type={a.status as ActivityStatus}>{a.status}</Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  </motion.div>
);

export default DashboardPage;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminProviderRequestsTab from "./tabs/AdminProviderRequestsTab";
import AdminActiveProvidersTab from "./tabs/AdminActiveProvidersTab";
import AdminSuspendedProvidersTab from "./tabs/AdminSuspendedProvidersTab";

type TabTypes = "requests" | "active" | "suspended";

export default function AdminProvidersPage() {
  const [activeTab, setActiveTab] = useState<TabTypes>("requests");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setReloadKey((prev) => prev + 1);
  }, [search, page, activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Provider Management
        </h1>

        <input
          placeholder="Search provider..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); 
          }}
          className="border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      {/* TABS */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            activeTab === "requests"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Provider Requests
        </button>

        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            activeTab === "active"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active Providers
        </button>

        <button
          onClick={() => setActiveTab("suspended")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            activeTab === "suspended"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Suspended
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "requests" && (
        <AdminProviderRequestsTab
          key={reloadKey}
          search={search}
          page={page}
        />
      )}

      {activeTab === "active" && (
        <AdminActiveProvidersTab
          key={reloadKey}
          search={search}
          page={page}
        />
      )}

      {activeTab === "suspended" && (
        <AdminSuspendedProvidersTab
          key={reloadKey}
          search={search}
          page={page}
        />
      )}

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-2 pt-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border rounded-lg text-sm"
        >
          Prev
        </button>

        <span className="text-sm text-gray-500">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded-lg text-sm"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
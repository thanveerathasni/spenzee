import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
import Sidebar  from "../../components/admin/sidebar/Sidebar";
import  Header  from "../../components/admin/header/Header";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import type { AdminSection } from "../../components/admin/nav.config";

export default function DashboardLayout() {
  const [activeSection, setActiveSection] =
    useState<AdminSection>("dashboard");

  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <motion.div className="min-h-screen flex flex-col bg-[#F5F6F8]">
      <Header
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isExpanded={expanded}
          activeSection={activeSection}
          onToggle={() => setExpanded((v) => !v)}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </motion.div>
  );
}

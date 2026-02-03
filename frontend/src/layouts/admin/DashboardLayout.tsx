

import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../../components/admin/sidebar/Sidebar";
import Header from "../../components/admin/header/Header";
import RouteTransition from "../../components/admin/RouteTransition";

import type { AdminSection } from "../../components/admin/nav.config";

export default function DashboardLayout() {
  const location = useLocation();
  const [activeSection, setActiveSection] =
    useState<AdminSection>("dashboard");

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F5F6F8] overflow-hidden">
      <Header
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          isExpanded
        />

        <main className="flex-1 h-full overflow-y-auto bg-white rounded-tl-3xl p-6 lg:p-10">
          <RouteTransition key={location.pathname}>
            <Outlet />
          </RouteTransition>
        </main>
      </div>
    </div>
  );
}

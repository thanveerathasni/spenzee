import type { ReactNode } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Header from "../../components/admin/header/Header";
import { motion } from "framer-motion";
import { useState } from "react";
import type { AdminSection } from "../../components/admin/nav.config";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
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
          {children}
        </main>
      </div>
    </motion.div>
  );
}
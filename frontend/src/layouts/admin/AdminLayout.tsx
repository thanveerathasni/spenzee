// // import type { ReactNode } from "react";
// // import Sidebar from "../../components/admin/sidebar/Sidebar";
// // import Header from "../../components/admin/header/Header";
// // import { motion } from "framer-motion";
// // import { useState } from "react";
// // import type { AdminSection } from "../../components/admin/nav.config";

// // interface Props {
// //   children: ReactNode;
// // }

// // export default function AdminLayout({ children }: Props) {
// //   const [activeSection, setActiveSection] =
// //     useState<AdminSection>("dashboard");

// //   const [expanded, setExpanded] = useState<boolean>(true);

// //   return (
// //     <motion.div className="min-h-screen flex flex-col bg-[#F5F6F8]">
// //       <Header
// //         activeSection={activeSection}
// //         onSectionChange={setActiveSection}
// //       />

// //       <div className="flex flex-1 overflow-hidden">
// //         <Sidebar
// //           isExpanded={expanded}
// //           activeSection={activeSection}
// //           onToggle={() => setExpanded((v) => !v)}
// //         />

// //         <main className="flex-1 p-8 overflow-y-auto">
// //           {children}
// //         </main>
// //       </div>
// //     </motion.div>
// //   );
// // }











// import { useState } from "react";
// import AdminSidebar from "../../components/admin/sidebar/AdminSidebar";
// import AdminNavbar from "../../components/admin/navbar/AdminNavbar";
// import { motion, AnimatePresence } from "framer-motion";

// interface Props {
//   children: React.ReactNode;
// }

// export default function AdminLayout({ children }: Props) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="min-h-screen bg-[#F8F7F4] flex">
//       <AdminSidebar open={sidebarOpen} />
//       <div className={`flex-1 flex flex-col transition-all duration-500 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
//         <AdminNavbar onMenuClick={() => setSidebarOpen(v => !v)} />
//         <main className="flex-1 px-6 md:px-10 pt-24 pb-12">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={Math.random()}
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//             >
//               {children}
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   );
// }










import { useState } from "react";
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar";
import AdminNavbar from "../../components/admin/navbar/AdminNavbar";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">
      
      {/* SIDEBAR */}
      <AdminSidebar open={sidebarOpen} />

      {/* MAIN WRAPPER */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        {/* NAVBAR */}
        <AdminNavbar onMenuClick={() => setSidebarOpen((v) => !v)} />

        {/* CONTENT */}
        <main className="flex-1 pt-20 pb-10 px-4 md:px-8 lg:px-12">
          
          {/* CONTENT CONTAINER (fix stretched UI) */}
          <div className="max-w-[1400px] mx-auto w-full">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname} // ✅ FIXED (no random)
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {children}
              </motion.div>
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
}
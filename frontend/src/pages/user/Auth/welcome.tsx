// import React from "react";
// import { motion } from "framer-motion";
// import { Menu, X, ArrowRight } from "lucide-react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../store/store";
// import { useNavigate } from "react-router-dom";
// import { clearTokens } from "../../../util/tokenStorage";
// import { logoutApi } from "../../../api/authApi";

// /* ---------------- NAVBAR ---------------- */

// const Navbar: React.FC = () => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const navigate = useNavigate();
//   const navItems = ["Dashboard", "Profile", "Logout"];

//   const handleLogout = async () => {
//     try {
//       await logoutApi();
//     } catch (e) {
//       // ignore
//     } finally {
//       clearTokens();
//       navigate("/login");
//     }
//   };

//   const handleNavClick = (item: string) => {
//     setIsOpen(false);
//     if (item === "Logout") {
//       handleLogout();
//     } else if (item === "Dashboard") {
//       navigate("/dashboard");
//     } else if (item === "Profile") {
//       navigate("/profile");
//     }
//   };

//   return (
//     <motion.nav
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
//       className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 bg-white border-b border-black/5"
//     >
//       <div className="font-serif text-2xl font-medium tracking-tight text-black">
//         Spenzee
//       </div>

//       {/* Desktop Menu */}
//       <div className="hidden md:flex items-center space-x-10">
//         {navItems.map((item) => (
//           <button
//             key={item}
//             onClick={() => handleNavClick(item)}
//             className="text-[11px] uppercase tracking-[0.25em] font-sans text-black/50 hover:text-black transition"
//           >
//             {item}
//           </button>
//         ))}
//       </div>

//       {/* Mobile Toggle */}
//       <div className="md:hidden">
//         <button onClick={() => setIsOpen(!isOpen)} className="text-black">
//           {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="absolute top-full left-0 w-full bg-white border-b border-black/10 py-8 px-6 flex flex-col space-y-6 md:hidden z-40"
//         >
//           {navItems.map((item) => (
//             <button
//               key={item}
//               onClick={() => handleNavClick(item)}
//               className="text-sm uppercase tracking-[0.15em] font-medium text-black/70 border-b border-black/5 pb-2 text-left"
//             >
//               {item}
//             </button>
//           ))}
//         </motion.div>
//       )}
//     </motion.nav>
//   );
// };

// /* ---------------- WELCOME PAGE ---------------- */

// const WelcomePage: React.FC = () => {
//   const userName = useSelector((state: RootState) => state.auth.userName);
//   const navigate = useNavigate();

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.3, delayChildren: 0.5 },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
//     },
//   };

//   return (
//     <div className="relative w-screen h-screen flex flex-col bg-white overflow-hidden">
//       <Navbar />

//       <main className="flex-1 flex items-center justify-center px-6 md:px-24">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="text-center w-full max-w-5xl"
//         >
//           <motion.h1
//             variants={itemVariants}
//             className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-black mb-4"
//           >
//             Welcome back,
//             <br />
//             <span className="italic font-serif font-normal">
//               {userName || "User"}
//             </span>
//           </motion.h1>

//           <motion.p
//             variants={itemVariants}
//             className="text-xs md:text-sm font-sans text-black/40 uppercase tracking-[0.35em] mb-12"
//           >
//             Your personalized experience is ready.
//           </motion.p>

//           <motion.div variants={itemVariants} className="flex justify-center">
//             <motion.button
//               whileHover={{ scale: 1.02, backgroundColor: "#000" }}
//               whileTap={{ scale: 0.98 }}
//               className="group flex items-center justify-center gap-4 px-14 py-5 bg-black text-white text-xs uppercase tracking-[0.25em] font-medium transition"
//               onClick={() => navigate("/dashboard")}
//             >
//               <span>Go to Dashboard</span>
//               <ArrowRight
//                 size={18}
//                 className="group-hover:translate-x-1 transition-transform duration-300"
//               />
//             </motion.button>
//           </motion.div>
//         </motion.div>
//       </main>

//       <motion.footer
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1.5, duration: 1 }}
//         className="px-12 py-8 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-black/30 w-full"
//       >
//         <div className="hidden md:block">Est. MMXXIV</div>
//         <div className="w-full text-center md:w-auto">
//           © Spenzee Protocol — All Rights Reserved
//         </div>
//         <div className="hidden md:block">Quiet Luxury Tier</div>
//       </motion.footer>
//     </div>
//   );
// };

// export default WelcomePage;












import React from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../../../util/tokenStorage";
import { logoutApi } from "../../../api/authApi";
import Swal from "sweetalert2";

/* ---------------- NAVBAR ---------------- */

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const navItems = ["Dashboard", "Profile", "Logout"];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Log out?",
      text: "You will be signed out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      color: "#000000",
      confirmButtonColor: "#000000",
      cancelButtonColor: "#cccccc",
    });

    if (!result.isConfirmed) return;

    try {
      await logoutApi();
    } catch (e) {
      // ignore backend failure
    } finally {
      clearTokens();
      navigate("/login", { replace: true });
    }
  };

  const handleNavClick = (item: string) => {
    setIsOpen(false);
    if (item === "Logout") {
      handleLogout();
    } else if (item === "Dashboard") {
      navigate("/dashboard");
    } else if (item === "Profile") {
      navigate("/profile");
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 bg-white border-b border-black/5"
    >
      <div className="font-serif text-2xl font-medium tracking-tight text-black">
        Spenzee
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-10">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => handleNavClick(item)}
            className="text-[11px] uppercase tracking-[0.25em] font-sans text-black/50 hover:text-black transition"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-black">
          {isOpen ? (
            <X size={24} strokeWidth={1.5} />
          ) : (
            <Menu size={24} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full left-0 w-full bg-white border-b border-black/10 py-8 px-6 flex flex-col space-y-6 md:hidden z-40"
        >
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="text-sm uppercase tracking-[0.15em] font-medium text-black/70 border-b border-black/5 pb-2 text-left"
            >
              {item}
            </button>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

/* ---------------- WELCOME PAGE ---------------- */

const WelcomePage: React.FC = () => {
  const userName = useSelector((state: RootState) => state.auth.userName);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 md:px-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center w-full max-w-5xl"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-black mb-4"
          >
            Welcome back,
            <br />
            <span className="italic font-serif font-normal">
              {userName || "User"}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xs md:text-sm font-sans text-black/40 uppercase tracking-[0.35em] mb-12"
          >
            Your personalized experience is ready.
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#000" }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-4 px-14 py-5 bg-black text-white text-xs uppercase tracking-[0.25em] font-medium transition"
              onClick={() => navigate("/dashboard")}
            >
              <span>Go to Dashboard</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="px-12 py-8 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-black/30 w-full"
      >
        <div className="hidden md:block">Est. MMXXIV</div>
        <div className="w-full text-center md:w-auto">
          © Spenzee Protocol — All Rights Reserved
        </div>
        <div className="hidden md:block">Quiet Luxury Tier</div>
      </motion.footer>
    </div>
  );
};

export default WelcomePage;

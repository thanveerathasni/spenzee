






import React from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
// import { clearTokens } from "../../../util/tokenStorage";
import { authApi } from "../../../api/auth.api";
import Swal from "sweetalert2";
import { clearAuth } from "../../../store/auth";
import { useDispatch } from "react-redux";
import { ROUTES } from "../../../constants/routes";
import { ALERT_MESSAGES } from "../../../constants/messages";
/* ---------------- NAVBAR ---------------- */

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const navItems = ["Dashboard", "Profile", "Logout"];
const dispatch = useDispatch();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: ALERT_MESSAGES.AUTH.LOGOUT_TITLE,
      text: ALERT_MESSAGES.AUTH.LOGOUT_TEXT,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: ALERT_MESSAGES.AUTH.LOGOUT_CONFIRM,
      cancelButtonText: ALERT_MESSAGES.AUTH.LOGOUT_CANCEL,
      background: "#ffffff",
      color: "#000000",
      confirmButtonColor: "#000000",
      cancelButtonColor: "#cccccc",
    });

    if (!result.isConfirmed) return;

    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
    localStorage.removeItem("accessToken");
      dispatch(clearAuth());  
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    }
  };

  const handleNavClick = (item: string) => {
    setIsOpen(false);
    if (item === "Logout") {
      handleLogout();
    } else if (item === "Dashboard") {
      navigate(ROUTES.USER.DASHBOARD);
    } else if (item === "Profile") {
     navigate(ROUTES.USER.PROFILE);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 bg-white dark:bg-black border-b border-black/5 dark:border-white/5 transition-colors duration-700"
    >
      <div className="font-serif text-2xl font-medium tracking-tight text-black dark:text-white transition-colors duration-700">
        Spenzee
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-10">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => handleNavClick(item)}
            className="text-[11px] uppercase tracking-[0.25em] font-sans text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors duration-700"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-black dark:text-white transition-colors duration-700">
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
          className="absolute top-full left-0 w-full bg-white dark:bg-black border-b border-black/10 dark:border-white/10 py-8 px-6 flex flex-col space-y-6 md:hidden z-40 transition-colors duration-700"
        >
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="text-sm uppercase tracking-[0.15em] font-medium text-black/70 dark:text-white/70 border-b border-black/5 dark:border-white/5 pb-2 text-left transition-colors duration-700"
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
  const user = useSelector((state: RootState) => state.auth.user);
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
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-white dark:bg-black overflow-hidden transition-colors duration-700">
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
            className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-black dark:text-white mb-4 transition-colors duration-700"
          >
            Welcome back,
            <br />
            <span className="italic font-serif font-normal">
  {user?.name ??
    user?.email?.split("@")[0] ??
    "User"}
</span>

          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xs md:text-sm font-sans text-black/40 dark:text-white/40 uppercase tracking-[0.35em] mb-12 transition-colors duration-700"
          >
            Your personalized experience is ready.
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-4 px-14 py-5 bg-black text-white dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-700"
              onClick={() => navigate("/user/dashboard")}
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
        className="px-12 py-8 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-black/30 dark:text-white/30 transition-colors duration-700 w-full"
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

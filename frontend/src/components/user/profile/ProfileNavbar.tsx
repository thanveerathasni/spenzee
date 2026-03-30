import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

export default function ProfileNavbar() {
  const navigate = useNavigate();

  return (
      <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 
      backdrop-blur-lg bg-white/70 border-b border-gray-200 
      h-20 flex items-center justify-between px-8 md:px-16"
    >
      <div
        onClick={() => navigate(ROUTES.USER.WELCOME)}
        className="cursor-pointer font-serif text-xl"
      >
        Spenzee
      </div>

      <div className="hidden md:flex gap-8 text-sm uppercase">
        <button onClick={() => navigate(ROUTES.USER.DASHBOARD)}>
          Dashboard
        </button>

        <button className="border-b border-black pb-1">
          Profile
        </button>
      </div>
    </motion.nav>
  );
}
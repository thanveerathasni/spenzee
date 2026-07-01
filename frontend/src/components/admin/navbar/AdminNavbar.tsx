import { Menu, Bell, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { adminAuthApi } from "../../../api/admin/adminAuth.api";

import {
  clearAdminAuth,
} from "../../../store/admin/adminAuth.slice";

import Swal from "sweetalert2";

interface Props {
  onMenuClick: () => void;
}

export default function AdminNavbar({
  onMenuClick,
}: Props) {
  const admin =
    useSelector(
      (
        state: RootState,
      ) =>
        state.adminAuth
          .admin,
    );

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const initials =
    admin?.email
      ?.slice(0, 2)
      .toUpperCase() ??
    "AD";

  const handleLogout =
    async () => {
      const result =
        await Swal.fire({
          title:
            "Sign out?",

          text:
            "You will be redirected to login.",

          icon:
            "warning",

          showCancelButton:
            true,

          confirmButtonColor:
            "#111",

          cancelButtonColor:
            "#e5e7eb",

          confirmButtonText:
            "Sign out",

          background:
            "#fff",

          color:
            "#111",
        });

      if (
        !result.isConfirmed
      ) {
        return;
      }

      try {
        await adminAuthApi.logout();
      } catch {
        console.log(
          "Admin logout API failed",
        );
      } finally {
        // /* ============================================== */
        // /* CLEAR STORAGE */
        // /* ============================================== */

        // localStorage.removeItem(
        //   "admin_auth",
        // );

        // sessionStorage.removeItem(
        //   "admin_auth",
        // );

        /* ============================================== */
/* LOGOUT FLAG */
/* ============================================== */

sessionStorage.setItem(
  "admin_logged_out",
  "true",
);

 localStorage.removeItem(
    "admin_auth",
  );

  sessionStorage.removeItem(
    "admin_auth",
  );
        /* ============================================== */
        /* CLEAR REDUX */
        /* ============================================== */

        dispatch(
          clearAdminAuth(),
        );

        /* ============================================== */
        /* REDIRECT */
        /* ============================================== */

        navigate(
          "/admin/login",
          {
            replace: true,
          },
        );
      }
    };

  return (
    <motion.header
      initial={{
        y: -60,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.7,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="fixed top-0 right-0 left-0 lg:left-64 z-40 flex items-center justify-between px-6 md:px-10 h-16 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] transition-all duration-500"
    >
      {/* ============================================== */}
      {/* LEFT */}
      {/* ============================================== */}

      <div className="flex items-center gap-4">
        <button
          onClick={
            onMenuClick
          }
          className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors"
        >
          <Menu size={18} />
        </button>

        {/* ============================================== */}
        {/* SEARCH */}
        {/* ============================================== */}

        <div className="hidden md:flex items-center gap-2.5 bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-2 w-64 group focus-within:border-black/20 transition-colors">
          <Search
            size={13}
            className="text-black/30 group-focus-within:text-black/60 transition-colors"
          />

          <input
            placeholder="Search anything..."
            className="bg-transparent text-sm text-black placeholder-black/25 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* ============================================== */}
      {/* RIGHT */}
      {/* ============================================== */}

      <div className="flex items-center gap-4">
        {/* ============================================== */}
        {/* BELL */}
        {/* ============================================== */}

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="relative w-9 h-9 flex items-center justify-center border border-black/[0.08] rounded-xl bg-white text-black/40 hover:text-black hover:border-black/20 transition-all"
        >
          <Bell size={15} />

          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full" />
        </motion.button>

        {/* ============================================== */}
        {/* DIVIDER */}
        {/* ============================================== */}

        <div className="w-px h-5 bg-black/10" />

        {/* ============================================== */}
        {/* ADMIN */}
        {/* ============================================== */}

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black uppercase tracking-widest text-black leading-none">
              {admin?.email ??
                "Admin"}
            </p>

            <p className="text-[9px] text-black/30 tracking-widest uppercase mt-0.5">
              Administrator
            </p>
          </div>

          <motion.button
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            onClick={
              handleLogout
            }
            className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center text-[10px] font-black tracking-wide"
          >
            {initials}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
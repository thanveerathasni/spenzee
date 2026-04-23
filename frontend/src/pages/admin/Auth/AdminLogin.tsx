
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { adminAuthApi } from "../../../api/admin/adminAuth.api";
import { adminAuthStore } from "../../../store/admin/adminAuth";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await adminAuthApi.login({ email, password });
      adminAuthStore.setToken(data.accessToken);
      toast.success("Admin authenticated");
      navigate("/admin/dashboard", { replace: true });
    } catch {
      toast.error("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 font-sans pt-24 sm:pt-28 lg:pt-32 ">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="mt-6 sm:mt-10 lg:mt-16 text-4xl md:text-5xl font-serif  mb-10 sm:mb-12 tracking-tighter"
      >
        Spenzee
      </motion.h1>

      {/* Card */}
      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl text-white mb-2 font-light">
            Admin Access
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Restricted system access
          </p>

          {/* Email */}
          <input
            type="email"
            placeholder="admin@spenzee.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition mb-6"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition mb-8"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-medium tracking-wide hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "VERIFYING..." : "ENTER ADMIN PANEL"}
          </button>
        </motion.form>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-700 text-[10px] tracking-[0.2em] uppercase">
        &copy; {new Date().getFullYear()} Spenzee Studios
      </footer>
    </div>
  );
};

export default AdminLogin;

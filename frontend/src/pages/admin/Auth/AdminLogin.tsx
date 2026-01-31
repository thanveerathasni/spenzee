// pages/admin/auth/AdminLogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminAuthApi } from "../../../api/admin.auth.api";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }

    try {
      const res = await adminAuthApi.login({ email, password });

      localStorage.setItem("admin_access", res.accessToken);

      toast.success("Admin login successful");
      navigate("/admin/dashboard", { replace: true });
    } catch {
      toast.error("Unauthorized admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 border border-neutral-800 rounded-2xl bg-black"
      >
        <h1 className="text-white text-2xl font-black uppercase mb-6 text-center">
          Admin Access
        </h1>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full mb-4 px-5 py-4 bg-neutral-900 rounded-xl text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-5 py-4 bg-neutral-900 rounded-xl text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full py-4 bg-white text-black rounded-xl font-black uppercase text-xs">
          Enter Admin Panel
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

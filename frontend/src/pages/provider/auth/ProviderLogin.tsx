import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/auth/auth.slice";

export default function ProviderLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/provider/auth/login", {
        email,
        password,
      });

      const { accessToken, provider } = res.data.data;

      // ✅ FIX: UPDATE REDUX (CRITICAL)
      dispatch(
        setAuth({
          accessToken,
          user: {
            ...provider,
            role: "provider",
          },
        })
      );

      toast.success("Login success");

      // ✅ navigate AFTER state update
      navigate("/provider/dashboard");

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;

        if (msg === "Account pending approval") {
          navigate("/provider/pending");
        }

        toast.error(msg || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4 w-[400px]"
      >
        <h1 className="text-xl font-bold text-gray-900">
          Provider Login
        </h1>

        <input
          placeholder="Email"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-3 rounded-xl">
          Login
        </button>
      </motion.form>
    </div>
  );
}
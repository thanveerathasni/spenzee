import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../../api/axios";

const ProviderPending = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get("/provider/request-status");
        const currentStatus = res.data.data.status;

        setStatus(currentStatus);

        if (currentStatus === "approved") {
          navigate("/provider/login", { replace: true });
        }
      } catch {
        // silent fail
      } finally {
        setChecking(false);
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111] p-10 rounded-2xl text-center space-y-4 max-w-md"
      >
        <h1 className="text-2xl font-bold">
          Request Submitted
        </h1>

        <p className="text-gray-400">
          Your provider account is under review.
        </p>

        <p className="text-sm text-gray-500">
          You will be notified once admin approves your request.
        </p>

        <div className="pt-4">
          <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm">
            Status: {checking ? "Checking..." : status}
          </span>
        </div>

        <div className="text-xs text-gray-600">
          {status === "pending" && "Email will be sent after approval"}
          {status === "approved" && "Approved. Redirecting to login"}
          {status === "rejected" && "Request rejected. Contact support"}
        </div>

        <div className="pt-6">
          <button
            onClick={() => navigate("/provider/login")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProviderPending;
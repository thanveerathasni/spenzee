import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import toast from "react-hot-toast";
import { mapApiError } from "../../../util/errorHandler";
import { ROUTES } from "../../../constants/routes";

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
          navigate(ROUTES.PROVIDER.LOGIN, { replace: true });
        }
      } catch (err: unknown) {
        const mapped = mapApiError(err);
        toast.error(mapped.message || "Failed to check status");
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
      <motion.div className="bg-[#111] p-10 rounded-2xl text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-bold">Request Submitted</h1>

        <p className="text-gray-400">
          Your provider account is under review.
        </p>

        <div>
          Status: {checking ? "Checking..." : status}
        </div>

        <button
          onClick={() => navigate(ROUTES.PROVIDER.LOGIN)}
          className="text-sm"
        >
          Back to Login
        </button>
      </motion.div>
    </div>
  );
};

export default ProviderPending;
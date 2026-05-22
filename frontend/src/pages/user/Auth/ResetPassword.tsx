



import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../../api/auth.api";
import { ALERT_MESSAGES } from "../../../constants/messages";
import { ROUTES } from "../../../constants/routes";
import { mapApiError } from "../../../util/errorHandler";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid or expired reset link");
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    }
  }, [token, email, navigate]);

  if (!token || !email) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        email,
        token,
        newPassword: password,
      });

      toast.success(ALERT_MESSAGES.AUTH.PASSWORD_RESET_SUCCESS);
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    } catch (err: unknown) {
      const mapped = mapApiError(err);
      toast.error(mapped.message || ALERT_MESSAGES.AUTH.PASSWORD_RESET_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border rounded"
      >
        <h1 className="text-xl mb-4">Reset Password</h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border"
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-2 border"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-black text-white"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
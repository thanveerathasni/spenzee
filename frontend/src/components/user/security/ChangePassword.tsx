import { useState } from "react";
import { authApi } from "../../../api/auth.api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  const handleReset = async () => {
    try {
      setLoading(true);

      await authApi.forgotPassword(user.email);

      alert("Reset link sent to email");
    } catch (error) {
      console.error(error);
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleReset}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </div>
  );
};

export default ChangePassword;
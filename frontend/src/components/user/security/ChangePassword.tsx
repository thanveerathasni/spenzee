// import { useState } from "react";
// import { authApi } from "../../../api/auth.api";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../store/store";

// const ChangePassword = () => {
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const user = useSelector((state: RootState) => state.auth.user);

//   if (!user) return null;

//   const handleReset = async () => {
//     try {
//       setLoading(true);

//       await authApi.forgotPassword(user.email);

//       alert("Reset link sent to email");
//     } catch (error) {
//       console.error(error);
//       alert("Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <button
//         onClick={handleReset}
//         className="bg-black text-white px-4 py-2 rounded-xl"
//       >
//         {loading ? "Sending..." : "Send Reset Link"}
//       </button>
//     </div>
//   );
// };

// export default ChangePassword;








import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { userProfileApi } from "../../../api/user/userProfile.api";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  const updatePassword = async () => {
    if (!currentPassword) {
      toast.error("Enter current password");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      setLoading(true);
      await userProfileApi.updatePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated");
    } catch {
      toast.error("Current password is incorrect or update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputType = showPasswords ? "text" : "password";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/40">
          Enter your current password before choosing a new one.
        </p>
        <button
          type="button"
          onClick={() => setShowPasswords((value) => !value)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 hover:text-white"
        >
          {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPasswords ? "Hide" : "Show"}
        </button>
      </div>

      <input
        type={inputType}
        placeholder="Current password"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        className="profile-input"
      />
      <input
        type={inputType}
        placeholder="New password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        className="profile-input"
      />
      <input
        type={inputType}
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        className="profile-input"
      />
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={updatePassword} disabled={loading}
        className="w-full py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update password"}
      </motion.button>
    </div>
  );
};

export default ChangePassword;

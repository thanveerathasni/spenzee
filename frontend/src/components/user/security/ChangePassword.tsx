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
import { authApi } from "../../../api/auth.api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return null;

  const handleReset = async () => {
    try {
      setLoading(true);
      await authApi.forgotPassword(user.email);
      toast.success("Reset link sent to your email");
    } catch { toast.error("Failed to send reset link"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/40">
        We'll send a password reset link to <span className="text-white/70">{user.email}</span>
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={handleReset} disabled={loading}
        className="w-full py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </motion.button>
    </div>
  );
};

export default ChangePassword;
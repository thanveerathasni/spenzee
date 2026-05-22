






import { useState } from "react";
import OtpModal from "../../otp/OtpModal";
import { requestEmailChangeApi, updateEmailApi } from "../../../api/user/user.api";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../../store/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors text-sm";

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState("");
  const [showOtp, setShowOtp]   = useState(false);
  const [verified, setVerified] = useState(false);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleRequest = async () => {
    if (!newEmail) return toast.error("Please enter a valid email");
    try {
      await requestEmailChangeApi(newEmail);
      toast.success("OTP sent to your new email");
      setShowOtp(true);
    } catch { toast.error("Failed to send OTP"); }
  };

  const handleOtpSuccess = () => {
    setVerified(true);
    setShowOtp(false);
    toast.success("OTP verified successfully");
  };

  const handleUpdate = async () => {
    if (!verified) return toast.error("Please verify OTP first");
    try {
      await updateEmailApi(newEmail);
      dispatch(clearAuth());
      toast.success("Email updated. Please login again");
      navigate("/login", { replace: true });
    } catch { toast.error("Failed to update email"); }
  };

  return (
    <div className="space-y-4">
      <input type="email" placeholder="Enter new email" value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)} className={inputCls} />

      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={!verified ? handleRequest : handleUpdate}
        className="w-full py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition"
      >
        {!verified ? "Send OTP" : "Update Email"}
      </motion.button>

      {showOtp && (
        <OtpModal type="email" email={newEmail}
          onClose={() => setShowOtp(false)} onSuccess={handleOtpSuccess} />
      )}
    </div>
  );
};

export default ChangeEmail;
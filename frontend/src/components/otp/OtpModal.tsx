import { useState } from "react";
import { motion } from "framer-motion";
import OtpInput from "./OtpInput";
import { useOtpTimer } from "./useOtpTimer";
import { verifyPasswordOtpApi } from "../../api/auth.api";
import { verifyEmailOtpApi } from "../../api/user/user.api";

interface Props {
  email?: string;
  type: "email" | "password";
  onClose: () => void;
  onSuccess: (email?: string) => void;
}

const OtpModal = ({ email, type, onClose, onSuccess }: Props) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { time, reset } = useOtpTimer(60);

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Enter full OTP");
      return;
    }

    try {
      setLoading(true);

      if (type === "password") {
        await verifyPasswordOtpApi(email || "", otpValue);
      } else {
        await verifyEmailOtpApi(email || "", otpValue);
      }

      onSuccess(email);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
   
      reset();
    } catch (error) {
      console.error(error);
      alert("Wait before retrying");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-2xl w-[350px]"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Verify OTP
        </h2>

        <OtpInput value={otp} setValue={setOtp} />

        <div className="text-center mt-3 text-sm text-gray-500">
          {time > 0 ? `Resend in ${time}s` : "You can resend now"}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-4 bg-black text-white py-2 rounded-xl"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          onClick={handleResend}
          disabled={time > 0}
          className="w-full mt-2 border py-2 rounded-xl disabled:opacity-50"
        >
          Resend OTP
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 text-sm text-gray-500"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default OtpModal;
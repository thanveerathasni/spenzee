import { useState } from "react";
import { motion } from "framer-motion";
import OtpInput from "./OtpInput";
import { useOtpTimer } from "./useOtpTimer";
import axios from "axios";

interface Props {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

const OtpModal = ({ email, onClose, onSuccess }: Props) => {
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

      await axios.post("/api/otp/verify", {
        email,
        otp: otpValue,
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      alert("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("/api/otp/send", { email });
      reset();
    } catch (err) {
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
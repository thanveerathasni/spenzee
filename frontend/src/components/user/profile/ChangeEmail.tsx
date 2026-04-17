import { useState } from "react";
import OtpModal from "../../otp/OtpModal";
import {
  requestEmailChangeApi,
  updateEmailApi,
} from "../../../api/user/user.api";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../../store/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [verified, setVerified] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRequest = async () => {
    if (!newEmail) {
      return toast.error("Please enter a valid email");
    }

    try {
      await requestEmailChangeApi(newEmail);
      toast.success("OTP sent to your new email ");
      setShowOtp(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP");
    }
  };

  const handleOtpSuccess = () => {
    setVerified(true);
    setShowOtp(false);
    toast.success("OTP verified successfully ");
  };

  const handleUpdate = async () => {
    if (!verified) {
      return toast.error("Please verify OTP first");
    }

    try {
      await updateEmailApi(newEmail);

      dispatch(clearAuth());

      toast.success("Email updated. Please login again ");

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update email");
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="email"
        placeholder="Enter new email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        className="border p-2 w-full rounded-xl"
      />

      {!verified ? (
        <button
          onClick={handleRequest}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Send OTP
        </button>
      ) : (
        <button
          onClick={handleUpdate}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Update Email
        </button>
      )}

      {showOtp && (
        <OtpModal
          type="email"
          email={newEmail}
          onClose={() => setShowOtp(false)}
          onSuccess={handleOtpSuccess}
        />
      )}
    </div>
  );
};

export default ChangeEmail;
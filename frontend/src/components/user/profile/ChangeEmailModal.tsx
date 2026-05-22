import { useState } from "react";
import toast from "react-hot-toast";
import { userProfileApi } from "../../../api/user/userProfile.api";

export default function ChangeEmailModal() {
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!newEmail) {
      toast.error("Enter email");
      return;
    }

    try {
      setLoading(true);
      await userProfileApi.requestEmailChange(newEmail);
      setOtpSent(true);
      toast.success("OTP sent");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    try {
      setLoading(true);
      await userProfileApi.confirmEmailChange(newEmail, otp);
      toast.success("Email updated");
    } catch {
      toast.error("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        placeholder="New Email"
        value={newEmail}
        onChange={(event) => setNewEmail(event.target.value)}
        className="profile-input"
      />

      {otpSent && (
        <input
          placeholder="OTP"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          className="profile-input"
        />
      )}

      <button
        type="button"
        onClick={otpSent ? verifyOtp : sendOtp}
        disabled={loading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
      >
        {loading ? "Please wait" : otpSent ? "Verify OTP" : "Send OTP"}
      </button>
    </div>
  );
}

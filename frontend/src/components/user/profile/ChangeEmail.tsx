import { useState } from "react";
import OtpModal from "../otp/OtpModal";
import { requestEmailChangeApi } from "@/api/user.api";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/auth";

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const dispatch = useDispatch();

  const handleRequest = async () => {
    if (!newEmail) return alert("Enter email");

    try {
      await requestEmailChangeApi(newEmail);
      setShowOtp(true);
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  const handleSuccess = (email: string) => {
    dispatch(setAuth({ user: { email } }));
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

      <button
        onClick={handleRequest}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        Change Email
      </button>

      {showOtp && (
        <OtpModal
          email={newEmail}
          onClose={() => setShowOtp(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ChangeEmail;
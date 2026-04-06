import { useState } from "react";
import { userProfileApi } from "../../../api/user/userProfile.api";
import toast from "react-hot-toast";

export default function ChangeEmailModal() {
  const [step, setStep] = useState(0);

  const [currentEmail, setCurrentEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // STEP 1 → SEND OTP
  const sendOtp = async () => {
    try {
      await userProfileApi.sendEmailOtp({ email: currentEmail });
      toast.success("OTP sent");
      setStep(1);
    } catch {
      toast.error("Failed");
    }
  };

  // STEP 2 → VERIFY OTP
  const verifyOtp = async () => {
    try {
      await userProfileApi.verifyEmailOtp({ email: currentEmail, otp });
      toast.success("Verified");
      setStep(2);
    } catch {
      toast.error("Invalid OTP");
    }
  };

  // STEP 3 → UPDATE EMAIL
  const updateEmail = async () => {
    try {
      await userProfileApi.updateEmail({ newEmail });
      toast.success("Email updated");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="space-y-4">

      {step === 0 && (
        <>
          <input
            placeholder="Current Email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 1 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button onClick={updateEmail}>Update Email</button>
        </>
      )}

    </div>
  );
}
import { useState } from "react";
import { userProfileApi } from "../../../api/user/userProfile.api";
import toast from "react-hot-toast";

export default function ChangePasswordModal() {
  const [step, setStep] = useState(0);

  const [currentPassword, setCurrentPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [forgot, setForgot] = useState(false);

  // STEP 1 → VERIFY CURRENT PASSWORD
  const verifyCurrent = async () => {
    try {
      await userProfileApi.verifyPassword({ currentPassword });
      setStep(1);
    } catch {
      toast.error("Wrong password");
    }
  };

  // STEP 2 → SEND OTP
  const sendOtp = async () => {
    await userProfileApi.sendPasswordOtp();
    setStep(2);
  };

  // STEP 3 → VERIFY OTP
  const verifyOtp = async () => {
    await userProfileApi.verifyPasswordOtp({ otp });
    setStep(3);
  };

  // STEP 4 → UPDATE PASSWORD
  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords not match");
    }

    await userProfileApi.updatePassword({ newPassword });
    toast.success("Password updated");
  };

  return (
    <div className="space-y-4">

      {!forgot && step === 0 && (
        <>
          <input
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button onClick={verifyCurrent}>Verify</button>
          <p onClick={() => setForgot(true)}>Forgot Password?</p>
        </>
      )}

      {(forgot || step >= 1) && step === 1 && (
        <button onClick={sendOtp}>Send OTP</button>
      )}

      {step === 2 && (
        <>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={updatePassword}>Update</button>
        </>
      )}

    </div>
  );
}
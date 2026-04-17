import ChangeEmailModal from "./ChangeEmailModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { useState } from "react";

export default function Settings() {
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">

      <button
        onClick={() => setShowEmail(!showEmail)}
        className="bg-black text-white px-4 py-2"
      >
        Change Email
      </button>

      {showEmail && <ChangeEmailModal />}

      <button
        onClick={() => setShowPassword(!showPassword)}
        className="bg-black text-white px-4 py-2"
      >
        Change Password
      </button>

      {showPassword && <ChangePasswordModal />}

    </div>
  );
}
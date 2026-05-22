import { useState } from "react";
import toast from "react-hot-toast";
import { userProfileApi } from "../../../api/user/userProfile.api";

export default function ChangePasswordModal() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePassword = async () => {
    if (!currentPassword) {
      toast.error("Enter current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await userProfileApi.updatePassword({ currentPassword, newPassword });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        className="profile-input"
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        className="profile-input"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        className="profile-input"
      />
      <button
        type="button"
        onClick={updatePassword}
        disabled={loading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
      >
        {loading ? "Updating" : "Update Password"}
      </button>
    </div>
  );
}

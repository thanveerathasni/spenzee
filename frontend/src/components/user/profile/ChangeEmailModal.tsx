import { useState } from "react";
import { userProfileApi } from "../../../api/user/userProfile.api";
import toast from "react-hot-toast";

export default function ChangeEmailModal() {
  const [newEmail, setNewEmail] = useState("");

  const updateEmail = async () => {
    if (!newEmail) {
      return toast.error("Enter email");
    }

    try {
      await userProfileApi.updateProfile({ email: newEmail });
      toast.success("Email updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed");
    }
  };

  return (
    <div className="space-y-4">

      <input
        placeholder="New Email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        className="border p-2 w-full rounded-xl"
      />

      <button
        onClick={updateEmail}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        Update Email
      </button>

    </div>
  );
}
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { userProfileApi } from "../../../api/user/userProfile.api";

export default function EditProfile() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await userProfileApi.updateProfile({ name, phone });

      alert("Profile updated");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-3xl font-serif">Edit Profile</h2>

      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />

      
      <button disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
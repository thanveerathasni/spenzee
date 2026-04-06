import { useState } from "react";
import { useDispatch } from "react-redux";
import { userProfileApi } from "../../../api/user/userProfile.api";
import { setUser } from "../../../store/auth/auth.slice";
import { User } from "../../../types/user";
import toast from "react-hot-toast";

interface Props {
  user: User;
}

export default function PersonalInfoForm({ user }: Props) {
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      setLoading(true);

      const updated = await userProfileApi.updateProfile({
        name,
        phone,
      });

      dispatch(setUser(updated));
      toast.success("Personal info updated");

    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Personal Info</h3>

      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />

      <button onClick={handleSave}>
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
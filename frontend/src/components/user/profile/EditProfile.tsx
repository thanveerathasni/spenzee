import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

export default function EditProfile() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-3xl font-serif">Edit Profile</h2>

      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />

      <button type="submit">Save</button>
    </form>
  );
}
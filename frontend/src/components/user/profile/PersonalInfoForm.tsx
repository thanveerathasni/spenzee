


import { useState } from "react";
import { useDispatch } from "react-redux";
import { userProfileApi } from "../../../api/user/userProfile.api";
import { setUser } from "../../../store/auth/auth.slice";
import { User } from "../../../types/user";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { mapApiError } from "../../../util/errorHandler";
import { personalInfoSchema } from "../../../validation/profile";


interface Props { user: User; }

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors text-sm";
const labelCls = "text-xs text-white/30 uppercase tracking-widest mb-1 block";

export default function PersonalInfoForm({ user }: Props) {
  const [name, setName]   = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

const handleSave = async () => {
  const payload = {
    name: name || undefined,
    phone: phone || undefined,
  };

  if (!payload.name && !payload.phone) {
    toast.error("Nothing to update");
    return;
  }

  const result = personalInfoSchema.safeParse(payload);

  if (!result.success) {
    toast.error(result.error.issues[0]?.message);
    return;
  }

  try {
    setLoading(true);

    const updated = await userProfileApi.updateProfile(result.data);

    dispatch(setUser(updated));

    toast.success("Personal info updated");
  } catch (err) {
    const mapped = mapApiError(err);
    toast.error(mapped.message || "Failed to update");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
      <h3 className="text-white font-medium">Personal Info</h3>
      <div>
        <label className={labelCls}>Full Name</label>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div>
        <label className={labelCls}>Phone</label>
        <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={loading}
        className="w-full py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </motion.button>
    </div>
  );
}
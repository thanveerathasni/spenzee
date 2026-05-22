


import { useState } from "react";
import { User } from "../../../types/user";
import PersonalInfoForm from "./PersonalInfoForm";
import AddressSection from "./AddressSection";
import { motion, AnimatePresence } from "framer-motion";
import { userProfileApi } from "../../../api/user/userProfile.api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/auth/auth.slice";

interface Props {
  user: User;
}

export default function EditProfile({ user }: Props) {
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();

  const steps = [
    { label: "Personal", component: <PersonalInfoForm user={user} /> },
    { label: "Address", component: <AddressSection /> },
  ];

  const fields = [
    user.name,
    user.email,
    user.phone,
    user.profilePicture,
    user.address?.street,
    user.address?.city,
  ];

  const percent = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  );

  //  IMAGE UPLOAD HANDLER
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const updatedUser = await userProfileApi.uploadImage(file);

      dispatch(setUser(updatedUser)); 
      toast.success("Profile image updated");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-serif text-white">
        Edit Profile
      </h2>

      {/* IMAGE UPLOAD */}
      <div className="flex justify-center">
        <label className="cursor-pointer">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
            <img
              src={
                user.profilePicture ||
                "https://via.placeholder.com/150"
              }
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* PROGRESS */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div className="flex justify-between mb-2">
          <span>Profile Completion</span>
          <span>{percent}%</span>
        </div>

        <div className="h-2 bg-white/10">
          <div
            className="h-full bg-white"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-4 py-2 ${
              step === i ? "bg-white text-black" : "bg-gray-700 text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div key={step}>
          {steps[step].component}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

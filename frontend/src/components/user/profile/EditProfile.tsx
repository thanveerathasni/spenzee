import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { User } from "../../../types/user";
import PersonalInfoForm from "./PersonalInfoForm";
import AddressForm from "./AddressForm";
import AvatarUpload from "./AvatarUpload";
import { userProfileApi } from "../../../api/user/userProfile.api";
import { setUser } from "../../../store/auth/auth.slice";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
interface Props {
  user: User;
}

export default function EditProfile({ user }: Props) {
  const dispatch = useDispatch();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(user.profileImage);

  const steps = [
    { label: "Personal", component: <PersonalInfoForm user={user} /> },
    { label: "Address", component: <AddressForm user={user} /> },
  ];

  const fields = [
    user.name,
    user.email,
    user.phone,
    user.profileImage,
    user.address?.street,
    user.address?.city,
  ];

  const percent = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  );

  const handleImageChange = async (file: File) => {
    const tempUrl = URL.createObjectURL(file);
    setPreviewImage(tempUrl); 
    try {
      setLoading(true);

      const updatedUser = await userProfileApi.uploadImage(file);

      dispatch(setUser(updatedUser));

      setPreviewImage(updatedUser.profileImage);

      toast.success("Image updated");
    } catch {
      toast.error("Upload failed");
      setPreviewImage(user.profileImage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  setPreviewImage(user.profileImage);
}, [user.profileImage]);

  return (
    <div className="space-y-6">

      {/*  AVATAR */}
      <ImageUpload user={user} />

      {/* STEP NAV */}
      <div className="flex gap-4">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-4 py-2 rounded ${
              step === i ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* PROGRESS */}
      <div>
        <p>Profile Completion: {percent}%</p>
        <div className="h-2 bg-gray-200">
          <div
            className="h-2 bg-black"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div>{steps[step].component}</div>

    </div>
  );
}
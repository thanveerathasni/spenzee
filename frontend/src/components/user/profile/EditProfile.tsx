import { useState } from "react";
import { User } from "../../../types/user";
import PersonalInfoForm from "./PersonalInfoForm";
import AddressForm from "./AddressForm";
import ImageUpload from "./ImageUpload";

interface Props {
  user: User;
}

export default function EditProfile({ user }: Props) {
  const [step, setStep] = useState(0);

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

  return (
    <div className="space-y-6">

      {/* IMAGE UPLOAD */}
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
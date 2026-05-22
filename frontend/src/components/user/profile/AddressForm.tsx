import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";
import { AddressPayload } from "../../../api/user/userProfile.api";
import { Address } from "../../../types/user";
import { addressSchema } from "../../../validation/profile";

interface AddressFormProps {
  initialAddress?: Address;
  onCancel: () => void;
  onSubmit: (payload: AddressPayload) => Promise<void>;
}

const emptyPayload: AddressPayload = {
  fullName: "",
  phone: "",
  alternatePhone: "",
  houseName: "",
  street: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  postalCode: "",
  landmark: "",
  addressType: "home",
  isPrimary: false,
};

export default function AddressForm({
  initialAddress,
  onCancel,
  onSubmit,
}: AddressFormProps) {
  const [form, setForm] = useState<AddressPayload>(emptyPayload);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialAddress) {
      setForm(emptyPayload);
      return;
    }

    setForm({
      ...emptyPayload,
      ...initialAddress,
      postalCode: initialAddress.postalCode ?? initialAddress.pincode ?? "",
      addressType: initialAddress.addressType ?? "home",
      isPrimary: initialAddress.isPrimary ?? false,
    });
  }, [initialAddress]);

  const updateField = <Key extends keyof AddressPayload>(
    key: Key,
    value: AddressPayload[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    const result = addressSchema.safeParse(form);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);
      await onSubmit(result.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-white/10 bg-white/[0.03] rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="profile-input" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Full name" />
        <input className="profile-input" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Phone" />
        <input className="profile-input" value={form.alternatePhone ?? ""} onChange={(event) => updateField("alternatePhone", event.target.value)} placeholder="Alternate phone" />
        <input className="profile-input" value={form.houseName} onChange={(event) => updateField("houseName", event.target.value)} placeholder="House name" />
        <input className="profile-input md:col-span-2" value={form.street} onChange={(event) => updateField("street", event.target.value)} placeholder="Street" />
        <input className="profile-input" value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="City" />
        <input className="profile-input" value={form.district} onChange={(event) => updateField("district", event.target.value)} placeholder="District" />
        <input className="profile-input" value={form.state} onChange={(event) => updateField("state", event.target.value)} placeholder="State" />
        <input className="profile-input" value={form.country} onChange={(event) => updateField("country", event.target.value)} placeholder="Country" />
        <input className="profile-input" value={form.postalCode} onChange={(event) => updateField("postalCode", event.target.value)} placeholder="Postal code" />
        <input className="profile-input" value={form.landmark ?? ""} onChange={(event) => updateField("landmark", event.target.value)} placeholder="Landmark" />
        <select className="profile-input" value={form.addressType} onChange={(event) => updateField("addressType", event.target.value as AddressPayload["addressType"])}>
          <option value="home">Home</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="checkbox"
          checked={form.isPrimary}
          onChange={(event) => updateField("isPrimary", event.target.checked)}
        />
        Primary address
      </label>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-white/10 text-white/70 hover:text-white">
          <X size={18} />
        </button>
        <button type="button" onClick={handleSubmit} disabled={loading} className="h-10 px-4 inline-flex items-center gap-2 rounded-lg bg-white text-black text-sm font-medium disabled:opacity-50">
          <Check size={18} />
          {loading ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
}

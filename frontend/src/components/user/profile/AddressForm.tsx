import { useState } from "react";
import { useDispatch } from "react-redux";
import { userProfileApi } from "../../../api/user/userProfile.api";
import { setUser } from "../../../store/auth/auth.slice";
import { User } from "../../../types/user";
import toast from "react-hot-toast";

interface Props {
  user: User;
}

export default function AddressForm({ user }: Props) {
  const [street, setStreet] = useState(user.address?.street ?? "");
  const [city, setCity] = useState(user.address?.city ?? "");
  const [state, setState] = useState(user.address?.state ?? "");
  const [pincode, setPincode] = useState(user.address?.pincode ?? "");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      setLoading(true);

      const updated = await userProfileApi.updateAddress({
        street,
        city,
        state,
        pincode,
      });

      dispatch(setUser(updated));
      toast.success("Address updated");

    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Address</h3>

      <input value={street} onChange={(e) => setStreet(e.target.value)} />
      <input value={city} onChange={(e) => setCity(e.target.value)} />
      <input value={state} onChange={(e) => setState(e.target.value)} />
      <input value={pincode} onChange={(e) => setPincode(e.target.value)} />

      <button onClick={handleSave}>
        {loading ? "Saving..." : "Save Address"}
      </button>
    </div>
  );
}
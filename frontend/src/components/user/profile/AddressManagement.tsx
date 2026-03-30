import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

export default function AddressManagement() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [address, setAddress] = useState(user?.address || {});

  return (
    <div>
      <h2 className="text-3xl font-serif">Address</h2>

      <input
        placeholder="Street"
        value={address.street || ""}
        onChange={(e) =>
          setAddress({ ...address, street: e.target.value })
        }
      />
    </div>
  );
}
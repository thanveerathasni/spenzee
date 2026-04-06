import { Address } from "../../../types/user";
import ProfileCard from "./ProfileCard";

interface AddressCardProps {
  address: Address;
}

export default function AddressCard({ address }: AddressCardProps) {
  return (
    <ProfileCard>
      <h3 className="text-lg font-semibold mb-4">Address</h3>

      <div className="text-sm space-y-1">
        <p>{address.street}</p>
        <p>{address.city}</p>
        <p>{address.state}</p>
        <p>{address.pincode}</p>
      </div>
    </ProfileCard>
  );
}
import { Edit3, MapPin, Star, Trash2 } from "lucide-react";
import { Address } from "../../../types/user";
import ProfileCard from "./ProfileCard";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetPrimary: (address: Address) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetPrimary,
}: AddressCardProps) {
  return (
    <ProfileCard>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-white/40" />
            <h4 className="text-white text-sm font-medium truncate">
              {address.fullName || "Address"}
            </h4>
            {address.isPrimary && (
              <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">
                Primary
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-white/60 leading-6">
            {[address.houseName, address.street, address.city, address.district, address.state, address.country, address.postalCode ?? address.pincode]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p className="mt-2 text-xs text-white/40">{address.phone}</p>
        </div>

        <div className="flex shrink-0 gap-1">
          {!address.isPrimary && (
            <button type="button" title="Set primary" onClick={() => onSetPrimary(address)} className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10">
              <Star size={16} />
            </button>
          )}
          <button type="button" title="Edit" onClick={() => onEdit(address)} className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10">
            <Edit3 size={16} />
          </button>
          <button type="button" title="Delete" onClick={() => onDelete(address)} className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-red-300/70 hover:text-red-200 hover:bg-red-400/10">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </ProfileCard>
  );
}

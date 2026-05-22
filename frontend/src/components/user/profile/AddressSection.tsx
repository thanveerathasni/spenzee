import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import {
  AddressPayload,
  userProfileApi,
} from "../../../api/user/userProfile.api";
import { Address } from "../../../types/user";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

export default function AddressSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Address | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setAddresses(await userProfileApi.getAddresses());
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAddresses();
  }, []);

  const closeForm = () => {
    setEditing(undefined);
    setIsFormOpen(false);
  };

  const handleSubmit = async (payload: AddressPayload) => {
    try {
      if (editing?.id) {
        const updated = await userProfileApi.updateAddress(editing.id, payload);
        setAddresses((current) =>
          current.map((address) => (address.id === updated.id ? updated : address)),
        );
        toast.success("Address updated");
      } else {
        const created = await userProfileApi.addAddress(payload);
        setAddresses((current) => [created, ...current]);
        toast.success("Address added");
      }

      closeForm();
      await loadAddresses();
    } catch {
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (address: Address) => {
    if (!address.id) return;

    try {
      await userProfileApi.deleteAddress(address.id);
      setAddresses((current) => current.filter((item) => item.id !== address.id));
      toast.success("Address deleted");
      await loadAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSetPrimary = async (address: Address) => {
    if (!address.id) return;

    try {
      const updated = await userProfileApi.setPrimaryAddress(address.id);
      setAddresses((current) =>
        current.map((item) => ({
          ...item,
          isPrimary: item.id === updated.id,
        })),
      );
      toast.success("Primary address updated");
    } catch {
      toast.error("Failed to update primary address");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-serif text-white tracking-tight">Addresses</h2>
        <button
          type="button"
          onClick={() => {
            setEditing(undefined);
            setIsFormOpen(true);
          }}
          className="h-10 px-4 inline-flex items-center gap-2 rounded-lg bg-white text-black text-sm font-medium"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {isFormOpen && (
        <AddressForm
          initialAddress={editing}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {loading ? (
        <div className="h-28 animate-pulse rounded-lg border border-white/10 bg-white/[0.03]" />
      ) : addresses.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-white/50">
          No addresses saved yet.
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={(selected) => {
                setEditing(selected);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
              onSetPrimary={handleSetPrimary}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { userProfileApi } from "../../../api/user/userProfile.api";

  import { motion } from "framer-motion";


export default function AddressManagement() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await userProfileApi.updateAddress(formData);
      alert("Address updated");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* HEADER */}
      <div className="mb-10">
        <h2 className="text-3xl font-serif mb-2">Address</h2>
        <p className="text-gray-500 text-sm">
          Update your delivery address details
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STREET */}
        <div>
          <label className="text-xs text-gray-500 uppercase">
            Street
          </label>
          <input
            type="text"
            placeholder="Enter street"
            value={formData.street}
            onChange={(e) =>
              setFormData({ ...formData, street: e.target.value })
            }
            className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* CITY + STATE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">
              City
            </label>
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase">
              State
            </label>
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
            />
          </div>
        </div>

        {/* PINCODE */}
        <div>
          <label className="text-xs text-gray-500 uppercase">
            Pincode
          </label>
          <input
            type="text"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) =>
              setFormData({ ...formData, pincode: e.target.value })
            }
            className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        {/* BUTTON */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-full hover:opacity-90 transition"
          >
            Save Address
          </button>
        </div>
      </form>
    </motion.div>
  );
}
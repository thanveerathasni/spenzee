import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin/adminAxios";
import { motion } from "framer-motion";

interface Provider {
  brandName: string;
  email: string;
  status: string;
}

export default function AdminProviderDetails() {
  const { id } = useParams();
  const [provider, setProvider] = useState<Provider | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await adminApi.get(`/admin/providers/${id}`);
      setProvider(res.data.data);
    };

    fetch();
  }, [id]);

  if (!provider) return <div className="p-6">Loading...</div>;

  return (
    <motion.div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Provider Details
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
        <p><b>Brand:</b> {provider.brandName}</p>
        <p><b>Email:</b> {provider.email}</p>
        <p><b>Status:</b> {provider.status}</p>

        {/* FAKE EXTRA DATA */}
        <p><b>Revenue:</b> ₹2,45,000</p>
        <p><b>Orders:</b> 320</p>
        <p><b>Rating:</b> ⭐ 4.5</p>
      </div>
    </motion.div>
  );
}
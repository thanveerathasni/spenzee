import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axios";
import toast from "react-hot-toast";
import axios from "axios";

const ProviderRequestForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brandName: "",
    website: "",
    category: "",
    email: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/provider/requests", {
        brandName: formData.brandName,
        websiteUrl: formData.website,
        primaryCategory: formData.category,
        contactEmail: formData.email,
        description: formData.description,
      });

      toast.success("Request submitted ");
     navigate("/provider/pending");

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] space-y-4 bg-[#111] p-6 rounded-2xl shadow-lg"
      >
        <h1 className="text-xl font-bold text-center">
          Provider Request
        </h1>

        <input
          name="brandName"
          placeholder="Brand Name"
          className="w-full p-3 bg-[#1a1a1a] rounded-lg"
          onChange={handleChange}
        />

        <input
          name="website"
          placeholder="Website"
          className="w-full p-3 bg-[#1a1a1a] rounded-lg"
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          className="w-full p-3 bg-[#1a1a1a] rounded-lg"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 bg-[#1a1a1a] rounded-lg"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-3 bg-[#1a1a1a] rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ProviderRequestForm;
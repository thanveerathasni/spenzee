import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../public/Landing";
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

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.brandName.trim()) newErrors.brandName = "Brand name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (!formData.category.trim()) newErrors.category = "Category required";
    if (!formData.description.trim()) newErrors.description = "Description required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await api.post("/provider/requests", {
        brandName: formData.brandName,
        websiteUrl: formData.website,
        primaryCategory: formData.category,
        contactEmail: formData.email,
        description: formData.description,
      });
      toast.success("Request submitted");
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
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center pt-28 px-6">
        <h1 className="text-4xl md:text-5xl font-serif text-black mb-10 tracking-tighter">
          Spenzee
        </h1>

        <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <header className="mb-8 text-center">
            <h1 className="text-xl text-white font-light">Become a Provider</h1>
            <p className="text-xs text-gray-500 tracking-widest uppercase mt-2">
              Submit your request
            </p>

            {/* User / Provider switch */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="px-6 py-2 rounded-lg font-bold text-sm bg-white/10 text-black hover:text-white transition"
              >
                User
              </button>
              <button
                type="button"
                className="px-6 py-2 rounded-lg font-bold text-sm bg-white text-black"
              >
                Provider
              </button>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Brand Name */}
            <div>
              <input
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Brand Name"
                className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
              />
              {errors.brandName && (
                <p className="text-xs text-red-500 mt-1">{errors.brandName}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Website (optional)"
                className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
              />
            </div>

            {/* Category */}
            <div>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
              />
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Contact Email"
                className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your brand..."
                rows={3}
                className="w-full bg-[#1A1A1A] border-b border-white/20 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition resize-none"
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-medium tracking-wide hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "SUBMIT REQUEST"}
            </button>
          </form>

          <footer className="mt-10 text-center text-xs text-gray-500">
            Already a provider?
            <button
              onClick={() => navigate("/provider/login")}
              className="ml-2 text-white hover:underline"
            >
              Sign In
            </button>
          </footer>
        </div>

        <div className="mt-12 text-gray-700 text-[10px] tracking-[0.2em] uppercase">
          &copy; {new Date().getFullYear()} Spenzee Studios
        </div>
      </div>
    </>
  );
};

export default ProviderRequestForm;
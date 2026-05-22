

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../public/Landing";
import { api } from "../../../api/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeField, setActiveField] = useState<string | null>(null);

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

  /* ── reusable field row ── */
  const FieldRow = ({
    id,
    label,
    children,
    error,
  }: {
    id: string;
    label: string;
    children: React.ReactNode;
    error?: string;
  }) => (
    <div
      className={`border-t transition-colors duration-300 ${
        activeField === id ? "border-white/60" : "border-white/10"
      }`}
    >
      <div className="pt-5 pb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
          {label}
        </label>
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-red-400 pb-3"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden p-14"
          style={{ background: "linear-gradient(145deg,#111 0%,#0a0a0a 100%)" }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.1 * i, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 bottom-0 w-px bg-white/[0.04] origin-top"
              style={{ left: `${(i + 1) * 16}%` }}
            />
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-20 -right-10 text-[22rem] font-black leading-none select-none pointer-events-none"
            style={{ color: "rgba(255,255,255,0.025)", fontFamily: "serif" }}
          >
            B
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/80 text-sm font-light tracking-[0.3em] uppercase"
          >
            Spenzee
          </motion.p>

          <div className="space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-px bg-white/40" />
                <span className="text-[10px] text-white/40 tracking-[0.35em] uppercase">
                  Partner Program
                </span>
              </div>
              <h2 className="text-[3.8rem] font-black text-white leading-[0.95] tracking-[-0.03em] uppercase">
                Grow<br />With<br /><span className="text-white/25">Us.</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-white/30 text-sm leading-relaxed max-w-[260px]"
            >
              Join the Spenzee provider network and reach thousands of users managing their finances.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex gap-8 pt-4"
            >
              {[["10K+", "Users"], ["Free", "To Join"], ["Fast", "Review"]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-white text-lg font-black tracking-tight">{num}</p>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-white/15 text-[10px] tracking-[0.3em] uppercase relative z-10"
          >
            © {new Date().getFullYear()} Spenzee Studios
          </motion.p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block w-px bg-white/[0.07] origin-top"
        />

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 xl:px-28 py-20 overflow-y-auto">

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:hidden text-white text-sm tracking-[0.3em] uppercase mb-16"
          >
            Spenzee
          </motion.p>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-5">
              New application
            </p>
            <h1 className="text-[3rem] sm:text-[4rem] font-black text-white tracking-[-0.03em] uppercase leading-[0.9]">
              Become<br />A Provider.
            </h1>
          </motion.div>

          {/* User / Provider toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex gap-2 mb-10"
          >
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border border-white/15 text-white/35 hover:text-white hover:border-white/50 transition-all duration-300"
            >
              User
            </button>
            <button
              type="button"
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black"
            >
              Provider
            </button>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="max-w-sm"
          >
            <FieldRow id="brandName" label="Brand Name" error={errors.brandName}>
              <input
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                onFocus={() => setActiveField("brandName")}
                onBlur={() => setActiveField(null)}
                placeholder="Your brand name"
                className="w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
              />
            </FieldRow>

            <FieldRow id="website" label="Website (optional)">
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                onFocus={() => setActiveField("website")}
                onBlur={() => setActiveField(null)}
                placeholder="https://yourbrand.com"
                className="w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
              />
            </FieldRow>

            <FieldRow id="category" label="Category" error={errors.category}>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                onFocus={() => setActiveField("category")}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. Food, Travel, Finance"
                className="w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
              />
            </FieldRow>

            <FieldRow id="email" label="Contact Email" error={errors.email}>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
                placeholder="you@brand.com"
                className="w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
              />
            </FieldRow>

            <FieldRow id="description" label="About Your Brand" error={errors.description}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setActiveField("description")}
                onBlur={() => setActiveField(null)}
                placeholder="Tell us what your brand does..."
                rows={3}
                className="w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none resize-none"
              />
            </FieldRow>

            <div className="border-t border-white/10 py-4 flex justify-between items-center">
              <span className="text-[9px] text-white/15 tracking-widest uppercase">
                Partner application
              </span>
              <button
                type="button"
                onClick={() => navigate("/provider/login")}
                className="text-[10px] text-white/25 hover:text-white/60 transition-colors tracking-widest uppercase"
              >
                Already a provider?
              </button>
            </div>

            {/* Submit */}
            <div className="border-t border-white/10 pt-10">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-5"
              >
                <motion.span
                  variants={{ hover: { x: 4 } }}
                  transition={{ duration: 0.2 }}
                  className="text-[2.8rem] font-black text-white uppercase tracking-[-0.03em] leading-none"
                >
                  {loading ? "..." : "Send"}
                </motion.span>
                <motion.div
                  variants={{ hover: { x: 8, backgroundColor: "#ffffff" } }}
                  transition={{ duration: 0.25 }}
                  className="w-12 h-12 border border-white/30 flex items-center justify-center"
                >
                  <motion.svg
                    variants={{ hover: { x: 2 } }}
                    transition={{ duration: 0.2 }}
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    className="text-white group-hover:text-black transition-colors duration-250"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </motion.div>
                <motion.span
                  variants={{ hover: { opacity: 1, x: 0 } }}
                  initial={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] text-white/30 uppercase tracking-[0.25em] hidden sm:block"
                >
                  {loading ? "Submitting..." : "Submit request"}
                </motion.span>
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </>
  );
};

export default ProviderRequestForm;
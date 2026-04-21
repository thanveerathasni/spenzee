import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/axios";

export default function ProviderProfile() {
  const [formData, setFormData] = useState({
    brandName: "",
    email: "",
    phone: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ newEmail: "", otp: "" });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  /* ✅ FIX: correct API */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/provider/profile");
        const provider = res.data.data;

        setFormData({
          brandName: provider.brandName || "",
          email: provider.email || "",
          phone: provider.phone || "",
          description: provider.description || "",
        });
      } catch {
        toast.error("Failed to load profile details");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  /* ✅ FIX: update UI from response */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.patch("/provider/profile", {
        brandName: formData.brandName,
        phone: formData.phone,
        description: formData.description,
      });

      const updated = res.data.data;

      setFormData({
        brandName: updated.brandName || "",
        email: updated.email || "",
        phone: updated.phone || "",
        description: updated.description || "",
      });

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center">Loading profile...</div>;


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
        <div className="flex items-center gap-6 z-10 relative">
          <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center relative group">
            <span className="text-3xl font-black text-gray-400">A</span>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-[10px] uppercase font-bold text-white tracking-widest text-center">Change<br/>Photo</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{formData.brandName}</h1>
            <p className="text-sm text-gray-500 font-medium">Provider ID: PRV-88291</p>
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-green-600 bg-green-50 px-2 py-1 rounded">
              Verified Account
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition">
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="flex-1 px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl opacity-70 font-medium text-gray-500"
                  />
                  <button 
                    type="button" 
                    onClick={() => setEmailModalOpen(true)}
                    className="px-4 py-3 bg-neutral-200 text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-300 transition"
                  >
                    Change Email
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Security</h2>
            <p className="text-sm text-gray-500 mb-4">Ensure your account is secure by using a strong password.</p>
            <button
              onClick={() => setPwdModalOpen(true)}
              className="w-full py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
{pwdModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative overflow-hidden"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Old Password</label>
          <input
            type="password"
            required
            value={passwordData.oldPassword}
            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">New Password</label>
          <input
            type="password"
            required
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm New Password</label>
          <input
            type="password"
            required
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium"
          />
        </div>
        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setPwdModalOpen(false)}
            className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pwdLoading}
            className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {pwdLoading ? "Saving..." : "Change Password"}
          </button>
        </div>
      </form>
    </motion.div>
  </div>
)}

{emailModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative overflow-hidden"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Change Email</h2>
      {!showOtpInput ? (
        <form onSubmit={handleRequestEmailChange} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">New Email Address</label>
            <input
              type="email"
              required
              value={emailData.newEmail}
              onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setEmailModalOpen(false);
                setEmailData({ newEmail: "", otp: "" });
              }}
              className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={emailLoading}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {emailLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyEmailChange} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Enter OTP</label>
            <p className="text-xs text-gray-500 mb-2">An OTP was sent to {emailData.newEmail}</p>
            <input
              type="text"
              required
              value={emailData.otp}
              onChange={(e) => setEmailData({ ...emailData, otp: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium text-center tracking-[0.5em]"
              placeholder="000000"
              maxLength={6}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowOtpInput(false)}
              className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={emailLoading}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {emailLoading ? "Verifying..." : "Verify & Save"}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  </div>
)}
    </motion.div>
  );
}

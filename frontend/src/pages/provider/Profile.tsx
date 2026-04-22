




import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, LogOut, X, Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../store/auth/auth.slice";

/* ─────────────── types ─────────────── */
interface FormData {
  brandName: string;
  email: string;
  websiteUrl: string;
  primaryCategory: string;
  description: string;
}

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface EmailData {
  newEmail: string;
  otp: string;
}

/* ─────────────── modal backdrop ─────────────── */
function ModalBackdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────── modal header ─────────────── */
function ModalHeader({
  icon,
  title,
  subtitle,
  onClose,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="relative p-6 border-b border-gray-100">
      <div className="absolute top-0 left-0 w-1 h-full bg-black rounded-l-2xl" />
      <div className="flex items-start justify-between pl-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            {icon}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────── password field ─────────────── */
function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-11 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium text-sm"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PASSWORD MODAL
═══════════════════════════════════════════════ */
function PasswordModal({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (key: keyof PasswordData) => (val: string) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (data.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await api.patch("/provider/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully!");
      onClose();
    } catch {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = data.newPassword;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader
        icon={<Lock size={18} />}
        title="Update Password"
        subtitle="Keep your account secure with a strong password"
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <PasswordField
          label="Current Password"
          value={data.oldPassword}
          onChange={set("oldPassword")}
          placeholder="Enter current password"
        />

        <PasswordField
          label="New Password"
          value={data.newPassword}
          onChange={set("newPassword")}
          placeholder="Enter new password"
        />

        {/* strength bar */}
        {data.newPassword.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength ? strengthColor : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 font-medium">{strengthLabel}</p>
          </div>
        )}

        <PasswordField
          label="Confirm New Password"
          value={data.confirmPassword}
          onChange={set("confirmPassword")}
          placeholder="Re-enter new password"
        />

        {data.confirmPassword && data.newPassword !== data.confirmPassword && (
          <p className="text-xs text-red-500 font-medium -mt-2">Passwords do not match</p>
        )}

        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
}

/* ═══════════════════════════════════════════════
                      EMAIL MODAL  
═══════════════════════════════════════════════ */
type EmailStep = "enter" | "otp" | "done";

function EmailModal({
  currentEmail,
  onClose,
  onEmailChanged,
}: {
  currentEmail: string;
  onClose: () => void;
  onEmailChanged: (email: string) => void;
}) {
  const [step, setStep] = useState<EmailStep>("enter");
  const [data, setData] = useState<EmailData>({ newEmail: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  /* countdown timer */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const sendOtp = async () => {
    if (!data.newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (data.newEmail === currentEmail) {
      toast.error("New email must be different from current email");
      return;
    }
    setLoading(true);
    try {
      await api.post("/provider/change-email/send-otp", { newEmail: data.newEmail });
      toast.success("OTP sent to your new email!");
      setStep("otp");
      setResendCooldown(60);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (data.otp.length < 4) {
      toast.error("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      await api.post("/provider/change-email/verify-otp", {
        newEmail: data.newEmail,
        otp: data.otp,
      });
      toast.success("Email changed successfully!");
      onEmailChanged(data.newEmail);
      setStep("done");
    } catch {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      await api.post("/provider/change-email/send-otp", { newEmail: data.newEmail });
      toast.success("OTP resent!");
      setResendCooldown(60);
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader
        icon={<Mail size={18} />}
        title="Change Email Address"
        subtitle={
          step === "enter"
            ? "Enter your new email to receive a verification code"
            : step === "otp"
            ? `Enter the OTP sent to ${data.newEmail}`
            : "Email updated successfully"
        }
        onClose={onClose}
      />

      <div className="p-6">
        {/* step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {(["enter", "otp", "done"] as EmailStep[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                  step === s
                    ? "bg-black text-white scale-110"
                    : s === "done" && step === "done"
                    ? "bg-green-500 text-white"
                    : ["enter", "otp"].indexOf(step) > i
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`h-px flex-1 transition-all duration-500 ${
                    ["enter", "otp"].indexOf(step) > i ? "bg-black" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── step 1: enter email ── */}
          {step === "enter" && (
            <motion.div
              key="enter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Current Email
                </label>
                <input
                  type="email"
                  value={currentEmail}
                  disabled
                  className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl opacity-60 font-medium text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={data.newEmail}
                  onChange={(e) => setData((d) => ({ ...d, newEmail: e.target.value }))}
                  placeholder="Enter new email address"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium text-sm"
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  A one-time verification code will be sent to this address.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Mail size={14} />
                      Send OTP
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── step 2: verify OTP ── */}
          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <ShieldCheck size={18} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-700">OTP sent to</p>
                  <p className="text-sm font-semibold text-gray-900">{data.newEmail}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={data.otp}
                  onChange={(e) =>
                    setData((d) => ({ ...d, otp: e.target.value.replace(/\D/g, "").slice(0, 6) }))
                  }
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-mono font-bold text-lg tracking-[0.3em] text-center"
                  onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep("enter");
                    setData((d) => ({ ...d, otp: "" }));
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 transition uppercase tracking-widest"
                >
                  ← Change Email
                </button>
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="text-xs font-bold text-gray-500 hover:text-black transition uppercase tracking-widest disabled:opacity-40"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading || data.otp.length < 4}
                  className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    "Verifying..."
                  ) : (
                    <>
                      <ShieldCheck size={14} />
                      Verify & Update
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── step 3: success ── */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-4 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-center"
              >
                <ShieldCheck size={32} className="text-green-500" />
              </motion.div>
              <div>
                <p className="text-base font-bold text-gray-900">Email Updated!</p>
                <p className="text-sm text-gray-500 mt-1">
                  Your email has been changed to{" "}
                  <span className="font-semibold text-gray-800">{data.newEmail}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-8 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalBackdrop>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function ProviderProfile() {
  const [formData, setFormData] = useState<FormData>({
    brandName: "",
    email: "",
    websiteUrl: "",
    primaryCategory: "",
    description: "",
  });
const navigate = useNavigate();
const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  /* FETCH */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/provider/profile");
        const provider = res.data.data;

        setFormData({
          brandName: provider.brandName || "",
          email: provider.email || "",
          websiteUrl: provider.websiteUrl || "",
          primaryCategory: provider.primaryCategory || "",
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

  /* UPDATE */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.patch("/provider/profile", {
        brandName: formData.brandName,
        websiteUrl: formData.websiteUrl,
        primaryCategory: formData.primaryCategory,
        description: formData.description,
      });

      const updated = res.data.data;

      setFormData({
        brandName: updated.brandName || "",
        email: updated.email || "",
        websiteUrl: updated.websiteUrl || "",
        primaryCategory: updated.primaryCategory || "",
        description: updated.description || "",
      });

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
  try {
    await api.post("/auth/logout"); // backend clear cookie
  } catch {
    // even if API fails, continue logout
  }

  dispatch(clearAuth()); 
  localStorage.removeItem("auth"); 
  localStorage.removeItem("provider_token"); 

  toast.success("Logged out");

  navigate("/provider/login"); // 
};

  if (fetching) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <>
      
      {pwdModalOpen && <PasswordModal onClose={() => setPwdModalOpen(false)} />}
      {emailModalOpen && (
        <EmailModal
          currentEmail={formData.email}
          onClose={() => setEmailModalOpen(false)}
          onEmailChanged={(email) => setFormData((prev) => ({ ...prev, email }))}
        />
      )}

    
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
          <div className="flex items-center gap-6 z-10 relative">
            <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center relative group">
              <span className="text-3xl font-black text-gray-400">A</span>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-[10px] uppercase font-bold text-white tracking-widest text-center">
                  Change
                  <br />
                  Photo
                </span>
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
       <button
  onClick={handleLogout}
  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition"
>
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
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Website URL
                    </label>
                    <input
                      type="text"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.primaryCategory}
                      onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Email Address
                  </label>
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
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Description
                  </label>
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
              <p className="text-sm text-gray-500 mb-4">
                Ensure your account is secure by using a strong password.
              </p>
              <button
                onClick={() => setPwdModalOpen(true)}
                className="w-full py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}





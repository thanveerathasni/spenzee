import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------- TYPES ---------- */

type NavigateView = "login";

interface SuccessPageProps {
  onNavigate: (view: NavigateView) => void;
}

/* ---------- SUCCESS PAGE ---------- */

export const SuccessPage: React.FC<SuccessPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-[#F6F5F3]">
      <div className="w-full max-w-sm bg-[#111111] rounded-2xl shadow-2xl p-8 md:p-12 text-white border border-white/5 text-center">
        <h1 className="font-serif text-3xl italic mb-6 tracking-tight">
          Spenzee
        </h1>

        <h2 className="text-xl font-medium mb-3">
          Password updated
        </h2>

        <p className="text-white/50 text-sm mb-6">
          Your password has been changed successfully.
        </p>

        <button
          onClick={() => onNavigate("login")}
          className="w-full bg-white text-black py-4 rounded-lg"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

/* ---------- MAIN PAGE ---------- */

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ---------- VALIDATION ---------- */

  const validate = () => {
    const newErrors = { password: "", confirmPassword: "" };
    let valid = true;

    if (!formData.password) {
      newErrors.password = "Password required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 characters";
      valid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate(); 

    if (!isValid) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1000);
  };

  /* ---------- SUCCESS ---------- */

  if (success) {
    return <SuccessPage onNavigate={() => navigate("/login")} />;
  }

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F5F3]">
      <div className="w-full max-w-md bg-[#111111] p-10 text-white">
        <h1 className="text-3xl mb-6">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            placeholder="New Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-2 bg-transparent border"
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password}</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmPassword: e.target.value,
              })
            }
            className="w-full p-2 bg-transparent border"
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm">
              {errors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black py-3"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
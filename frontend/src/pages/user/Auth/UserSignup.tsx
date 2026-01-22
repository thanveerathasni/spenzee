// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Navbar } from '../../public/Landing';
// import { signupSchema } from '../../../validation/signupSchema';
// import { signupApi, verifyOtpApi, resendOtpApi } from '../../../api/authApi';

// interface Errors {
//   name?: string;
//   email?: string;
//   password?: string;
//   confirmPassword?: string;
//   otp?: string;
// }

// const SignupForm: React.FC = () => {
//   const navigate = useNavigate();
//   const [showOtpField, setShowOtpField] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(60);
//   const [canResend, setCanResend] = useState(false);
//   const [loading, setLoading] = useState(false); // 🔒 lock

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     otp: '',
//   });

//   const [errors, setErrors] = useState<Errors>({});

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const runZodValidation = () => {
//     const result = signupSchema.safeParse(formData);
//     if (!result.success) {
//       const fieldErrors = result.error.flatten().fieldErrors;
//       const newErrors: Errors = {};
//       (Object.keys(fieldErrors) as (keyof Errors)[]).forEach((key) => {
//         newErrors[key] = fieldErrors[key]?.[0];
//       });
//       setErrors(newErrors);
//       return false;
//     }
//     return true;
//   };

//   useEffect(() => {
//     if (!showOtpField) return;
//     if (otpTimer === 0) {
//       setCanResend(true);
//       return;
//     }
//     const interval = setInterval(() => {
//       setOtpTimer((t) => t - 1);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [otpTimer, showOtpField]);

//   const handleResendOtp = async () => {
//     if (!canResend || loading) return;
//     setLoading(true);
//     try {
//       await resendOtpApi(formData.email);
//       alert(`OTP resent to ${formData.email}`);
//       setOtpTimer(60);
//       setCanResend(false);
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Resend failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (loading) return; // 🔒 block duplicates
//     setLoading(true);

//     if (!showOtpField) {
//       if (!runZodValidation()) {
//         setLoading(false);
//         return;
//       }
//       try {
//         await signupApi({
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           role: "user",
//         });
//         setShowOtpField(true);
//         setOtpTimer(60);
//         setCanResend(false);
//         setErrors({});
//       } catch (err: any) {
//         alert(err.response?.data?.message || "Signup failed");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       if (!runZodValidation()) {
//         setLoading(false);
//         return;
//       }
//       try {
//         await verifyOtpApi({
//           email: formData.email,
//           otp: formData.otp,
//         });
//         alert("Account verified! 🎉");
//         navigate('/login');
//       } catch (err: any) {
//         alert(err.response?.data?.message || "OTP verification failed");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="mt-20 max-w-md mx-auto px-4">
//         <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl">
//           <h1 className="text-3xl font-black text-center mb-8 uppercase tracking-tighter italic text-black dark:text-white">
//             Create Account
//           </h1>

//           <div className="flex justify-center gap-4 mb-6">
//             <button type="button" className="px-6 py-2 rounded-lg font-bold text-sm bg-black text-white dark:bg-white dark:text-black">
//               User
//             </button>
//             <button type="button" onClick={() => navigate('/provider/request')}
//               className="px-6 py-2 rounded-lg font-bold text-sm bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
//               Provider
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <button type="button" onClick={() => alert('Google Auth demo')}
//               className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-bold text-neutral-800 dark:text-neutral-200">
//               Continue with Google
//             </button>

//             <div className="space-y-4">
//               <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name"
//                 className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg" />
//               {errors.name && <p className="text-xs font-bold text-red-500">{errors.name}</p>}

//               <input name="email" value={formData.email} onChange={handleChange} placeholder="Email"
//                 className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg" />
//               {errors.email && <p className="text-xs font-bold text-red-500">{errors.email}</p>}

//               <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"
//                 className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg" />
//               {errors.password && <p className="text-xs font-bold text-red-500">{errors.password}</p>}

//               <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password"
//                 className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg" />
//               {errors.confirmPassword && <p className="text-xs font-bold text-red-500">{errors.confirmPassword}</p>}

//               {showOtpField && (
//                 <div>
//                   <label className="block text-xs font-black text-neutral-500 mb-2">
//                     OTP sent to {formData.email}
//                   </label>
//                   <input name="otp" value={formData.otp} onChange={handleChange} placeholder="6-digit code" maxLength={6}
//                     className="w-full px-4 py-3 bg-neutral-900 border rounded-lg" />
//                   {errors.otp && <p className="text-xs font-bold text-red-500">{errors.otp}</p>}
//                   {!canResend ? (
//                     <p className="text-xs font-bold text-neutral-500">Resend in {otpTimer}s</p>
//                   ) : (
//                     <button type="button" onClick={handleResendOtp}
//                       className="text-xs font-bold text-neutral-500 hover:underline">
//                       Resend OTP
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-4 mt-4 bg-neutral-900 rounded-xl font-black uppercase text-[11px] disabled:opacity-50"
//             >
//               {loading ? "Sending..." : showOtpField ? "Verify OTP" : "Sign Up"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignupForm;








import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../public/Landing';
import { signupSchema } from '../../../validation/signupSchema';
import { signupApi, verifyOtpApi, resendOtpApi } from '../../../api/authApi';

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });

  const [errors, setErrors] = useState<Errors>({});

  // 🚫 Block signup if already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/welcome", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const runZodValidation = () => {
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Errors = {};
      (Object.keys(fieldErrors) as (keyof Errors)[]).forEach((key) => {
        newErrors[key] = fieldErrors[key]?.[0];
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!showOtpField) return;
    if (otpTimer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setOtpTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer, showOtpField]);

  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    try {
      await resendOtpApi(formData.email);
      alert(`OTP resent to ${formData.email}`);
      setOtpTimer(60);
      setCanResend(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Resend failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!showOtpField) {
      if (!runZodValidation()) {
        setLoading(false);
        return;
      }
      try {
        await signupApi({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "user",
        });
        setShowOtpField(true);
        setOtpTimer(60);
        setCanResend(false);
        setErrors({});
      } catch (err: any) {
        alert(err.response?.data?.message || "Signup failed");
      } finally {
        setLoading(false);
      }
    } else {
      if (!runZodValidation()) {
        setLoading(false);
        return;
      }
      try {
        await verifyOtpApi({
          email: formData.email,
          otp: formData.otp,
        });
        alert("Account verified! 🎉");
        navigate('/login', { replace: true });
      } catch (err: any) {
        alert(err.response?.data?.message || "OTP verification failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-20 max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-black text-center mb-8 uppercase tracking-tighter italic text-black dark:text-white">
            Create Account
          </h1>

          <div className="flex justify-center gap-4 mb-6">
            <button type="button" className="px-6 py-2 rounded-lg font-bold text-sm bg-black text-white dark:bg-white dark:text-black">
              User
            </button>
            <button type="button" onClick={() => navigate('/provider/request')}
              className="px-6 py-2 rounded-lg font-bold text-sm bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
              Provider
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <button type="button" onClick={() => alert('Google Auth demo')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-bold text-neutral-800 dark:text-neutral-200">
              Continue with Google
            </button>

            <div className="space-y-4">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg" />
              {errors.name && <p className="text-xs font-bold text-red-500">{errors.name}</p>}

              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg" />
              {errors.email && <p className="text-xs font-bold text-red-500">{errors.email}</p>}

              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg" />
              {errors.password && <p className="text-xs font-bold text-red-500">{errors.password}</p>}

              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg" />
              {errors.confirmPassword && <p className="text-xs font-bold text-red-500">{errors.confirmPassword}</p>}

              {showOtpField && (
                <div>
                  <label className="block text-xs font-black text-neutral-500 mb-2">
                    OTP sent to {formData.email}
                  </label>
                  <input name="otp" value={formData.otp} onChange={handleChange} placeholder="6-digit code" maxLength={6}
                    className="w-full px-4 py-3 bg-neutral-900 border rounded-lg" />
                  {errors.otp && <p className="text-xs font-bold text-red-500">{errors.otp}</p>}
                  {!canResend ? (
                    <p className="text-xs font-bold text-neutral-500">Resend in {otpTimer}s</p>
                  ) : (
                    <button type="button" onClick={handleResendOtp}
                      className="text-xs font-bold text-neutral-500 hover:underline">
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-neutral-900 rounded-xl font-black uppercase text-[11px] disabled:opacity-50"
            >
              {loading ? "Sending..." : showOtpField ? "Verify OTP" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupForm;

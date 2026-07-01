import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import toast from "react-hot-toast";

import {
  Navbar,
} from "../../public/Landing";

import {
  authApi,
} from "../../../api/auth.api";

import {
  ALERT_MESSAGES,
} from "../../../constants/messages";

import {
  ROUTES,
} from "../../../constants/routes";

import {
  mapApiError,
} from "../../../util/errorHandler";

import PasswordInput from "../../../components/common/PasswordInput";

import FormField from "../../../components/common/FormField";

const ResetPassword:
React.FC = () => {
  const navigate =
    useNavigate();

  const [params] =
    useSearchParams();

  const token =
    params.get("token");

  const email =
    params.get("email");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    errors,
    setErrors,
  ] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const [
    activeField,
    setActiveField,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (
      !token ||
      !email
    ) {
      toast.error(
        "Invalid or expired reset link",
      );

      navigate(
        ROUTES.AUTH.LOGIN,
        {
          replace: true,
        },
      );
    }
  }, [
    token,
    email,
    navigate,
  ]);

  if (
    !token ||
    !email
  ) {
    return null;
  }

  const validate =
    () => {
      const newErrors: {
        password?: string;
        confirmPassword?: string;
      } = {};

      if (
        !password.trim()
      ) {
        newErrors.password =
          "Password is required";
      }

      if (
        password.length < 8
      ) {
        newErrors.password =
          "Password must be at least 8 characters";
      }

      if (
        password !==
        confirmPassword
      ) {
        newErrors.confirmPassword =
          "Passwords do not match";
      }

      setErrors(
        newErrors,
      );

      return (
        Object.keys(
          newErrors,
        ).length === 0
      );
    };

  const handleSubmit =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault();

      if (
        !validate()
      ) {
        return;
      }

      setLoading(true);

      try {
        await authApi.resetPassword(
          {
            email,
            token,
            newPassword:
              password,
          },
        );

        toast.success(
          ALERT_MESSAGES
            .AUTH
            .PASSWORD_RESET_SUCCESS,
        );

        navigate(
          ROUTES.AUTH.LOGIN,
          {
            replace: true,
          },
        );
      } catch (
        err: unknown
      ) {
        const mapped =
          mapApiError(
            err,
          );

        toast.error(
          mapped.message ||
            ALERT_MESSAGES
              .AUTH
              .PASSWORD_RESET_FAILED,
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden">

        {/* LEFT PANEL */}

        <motion.div
          initial={{
            x: -60,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1.1,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden p-14"
          style={{
            background:
              "linear-gradient(145deg,#111 0%,#0a0a0a 100%)",
          }}
        >
          {[...Array(6)].map(
            (_, i) => (
              <motion.div
                key={i}
                initial={{
                  scaleY: 0,
                  opacity: 0,
                }}
                animate={{
                  scaleY: 1,
                  opacity: 1,
                }}
                transition={{
                  delay:
                    0.1 *
                    i,
                  duration: 1.2,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="absolute top-0 bottom-0 w-px bg-white/[0.04] origin-top"
                style={{
                  left: `${
                    (i +
                      1) *
                    16
                  }%`,
                }}
              />
            ),
          )}

          <motion.div
            initial={{
              opacity: 0,
              scale: 1.2,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.4,
              duration: 1.5,
            }}
            className="absolute -bottom-20 -right-10 text-[22rem] font-black leading-none select-none pointer-events-none"
            style={{
              color:
                "rgba(255,255,255,0.025)",
              fontFamily:
                "serif",
            }}
          >
            S
          </motion.div>

          <motion.p
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
              duration: 0.8,
            }}
            className="text-white/80 text-sm font-light tracking-[0.3em] uppercase"
          >
            Spenzee
          </motion.p>

          <div className="space-y-8 relative z-10">
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
                duration: 1,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-px bg-white/40" />

                <span className="text-[10px] text-white/40 tracking-[0.35em] uppercase">
                  Secure Recovery
                </span>
              </div>

              <h2 className="text-[3.8rem] font-black text-white leading-[0.95] tracking-[-0.03em] uppercase">
                Create<br />
                New<br />
                <span className="text-white/25">
                  Access.
                </span>
              </h2>
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.8,
                duration: 0.8,
              }}
              className="text-white/30 text-sm leading-relaxed max-w-[260px]"
            >
              Set a strong
              new password
              and continue
              your journey.
            </motion.p>
          </div>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1.2,
              duration: 0.8,
            }}
            className="text-white/15 text-[10px] tracking-[0.3em] uppercase relative z-10"
          >
            ©{" "}
            {new Date().getFullYear()}{" "}
            Spenzee Studios
          </motion.p>
        </motion.div>

        {/* Divider */}

        <motion.div
          initial={{
            scaleY: 0,
          }}
          animate={{
            scaleY: 1,
          }}
          transition={{
            delay: 0.4,
            duration: 1.2,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="hidden lg:block w-px bg-white/[0.07] origin-top"
        />

        {/* RIGHT PANEL */}

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 xl:px-28 py-20">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
            }}
            className="mb-12"
          >
            <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-5">
              Password reset
            </p>

            <h1 className="text-[3.5rem] sm:text-[4.5rem] font-black text-white tracking-[-0.03em] uppercase leading-[0.9]">
              Reset<br />
              Pass.
            </h1>
          </motion.div>

          <motion.form
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
              duration: 0.8,
            }}
            onSubmit={
              handleSubmit
            }
            className="max-w-sm"
          >
            <FormField
              id="password"
              label="New Password"
              activeField={
                activeField
              }
              error={
                errors.password
              }
            >
              <PasswordInput
                value={
                  password
                }
                onChange={
                  setPassword
                }
                onFocus={() =>
                  setActiveField(
                    "password",
                  )
                }
                onBlur={() =>
                  setActiveField(
                    null,
                  )
                }
                placeholder="Enter new password"
                autoComplete="new-password"
                className="w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
              />
            </FormField>

            <FormField
              id="confirmPassword"
              label="Confirm Password"
              activeField={
                activeField
              }
              error={
                errors.confirmPassword
              }
            >
              <PasswordInput
                value={
                  confirmPassword
                }
                onChange={
                  setConfirmPassword
                }
                onFocus={() =>
                  setActiveField(
                    "confirmPassword",
                  )
                }
                onBlur={() =>
                  setActiveField(
                    null,
                  )
                }
                placeholder="Repeat password"
                autoComplete="new-password"
                className="w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none"
              />
            </FormField>

            <div className="border-t border-white/10 pt-10">
              <motion.button
                type="submit"
                disabled={
                  loading
                }
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="group flex items-center gap-5"
              >
                <motion.span
                  className="text-[2.8rem] font-black text-white uppercase tracking-[-0.03em] leading-none"
                >
                  {loading
                    ? "..."
                    : "Go"}
                </motion.span>

                <motion.div
                  className="w-12 h-12 border border-white/30 flex items-center justify-center"
                >
                  <motion.svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.div>
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </>
  );
};
export default ResetPassword;

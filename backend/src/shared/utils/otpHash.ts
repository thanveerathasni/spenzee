import crypto from "crypto";

const OTP_LENGTH = 6;

const DEFAULT_OTP_EXPIRY_MINUTES = 5;

/* ====================================================== */
/* GENERATE OTP */
/* ====================================================== */

export const generateOtp =
  (): string => {
    return Math.floor(
      100000 +
        Math.random() *
          900000,
    ).toString();
  };

/* ====================================================== */
/* HASH OTP */
/* ====================================================== */

export const hashOtp = (
  otp: string,
): string => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

/* ====================================================== */
/* COMPARE OTP */
/* ====================================================== */

export const compareOtp = (
  plainOtp: string,
  hashedOtp: string,
): boolean => {
  return (
    hashOtp(plainOtp) ===
    hashedOtp
  );
};

/* ====================================================== */
/* OTP EXPIRY */
/* ====================================================== */

export const getOtpExpiry = (
  minutes: number =
    DEFAULT_OTP_EXPIRY_MINUTES,
): Date => {
  return new Date(
    Date.now() +
      minutes *
        60 *
        1000,
  );
};

export const isOtpExpired = (
  expiresAt: Date,
): boolean => {
  return (
    expiresAt.getTime() <
    Date.now()
  );
};

/* ====================================================== */
/* OTP FORMAT */
/* ====================================================== */

export const validateOtpFormat =
  (
    otp: string,
  ): boolean => {
    return new RegExp(
      `^\\d{${OTP_LENGTH}}$`,
    ).test(otp);
  };
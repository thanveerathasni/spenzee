import { z } from "zod";

/* ====================================================== */
/* EMAIL */
/* ====================================================== */

export const emailSchema =
  z
    .string()
    .email(
      "Invalid email address",
    )
    .trim()
    .toLowerCase();

/* ====================================================== */
/* PASSWORD */
/* ====================================================== */

export const passwordSchema =
  z
    .string()
    .min(
      8,
      "Password must be at least 8 characters",
    )
    .max(
      100,
      "Password is too long",
    );

/* ====================================================== */
/* OTP */
/* ====================================================== */

export const otpSchema =
  z.string().regex(
    /^\d{6}$/,
    "OTP must be exactly 6 digits",
  );

/* ====================================================== */
/* OBJECT ID */
/* ====================================================== */

export const objectIdSchema =
  z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid ID format",
  );
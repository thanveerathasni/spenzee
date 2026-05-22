import crypto from "crypto";

/* ====================================================== */
/* GENERATE RESET TOKEN */
/* ====================================================== */

export const generateResetToken =
  (): string => {
    return crypto
      .randomBytes(32)
      .toString("hex");
  };

/* ====================================================== */
/* HASH RESET TOKEN */
/* ====================================================== */

export const hashResetToken =
  (
    token: string,
  ): string => {
    return crypto
      .createHash(
        "sha256",
      )
      .update(
        token.trim(),
      )
      .digest("hex");
  };
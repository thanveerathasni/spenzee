import crypto from "crypto";

/**
 * Generates a raw reset token (sent via email)
 */
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hashes reset token for DB storage (DETERMINISTIC)
 * MUST NOT use bcrypt
 */
export const hashResetToken = (token: string): string => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

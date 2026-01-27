import { z } from "zod";

/* ---------- Strong password ---------- */
const strongPassword = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .regex(/[A-Z]/, "Add at least one CAPITAL letter")
  .regex(/[a-z]/, "Add at least one small letter")
  .regex(/[0-9]/, "Add at least one number")
  .regex(/[^A-Za-z0-9]/, "Add at least one special character");

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: strongPassword,
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

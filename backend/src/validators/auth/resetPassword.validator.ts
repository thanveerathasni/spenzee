import { z } from "zod";

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z
      .string()
      .min(1, "Reset token is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100)
  })
});

export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>["body"];
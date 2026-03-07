import { z } from "zod";

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email")
      .trim()
      .toLowerCase()
  })
});

export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>["body"];
import { z } from "zod";

export const resendOtpSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email")
      .trim()
      .toLowerCase()
  })
});

export type ResendOtpDTO = z.infer<typeof resendOtpSchema>["body"];
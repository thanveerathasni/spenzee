import { z } from "zod";

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email")
      .trim()
      .toLowerCase(),

    otp: z
      .string()
      .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
  })
});

export type VerifyOtpDTO = z.infer<typeof verifyOtpSchema>["body"];
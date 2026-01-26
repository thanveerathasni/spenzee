import { z } from "zod";

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    otp: z.string().length(6, "OTP must be 6 digits")
  })
});
export type VerifyOtpDTO = z.infer<typeof verifyOtpSchema>["body"];

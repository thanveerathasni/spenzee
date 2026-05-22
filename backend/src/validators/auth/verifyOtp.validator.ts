import { z } from "zod";

import {
  emailSchema,
  otpSchema,
} from "../common.validator";

export const verifyOtpSchema =
  z.object({
    body: z.object({
      email:
        emailSchema,

      otp: otpSchema,
    }),
  });

export type VerifyOtpDTO =
  z.infer<
    typeof verifyOtpSchema
  >["body"];
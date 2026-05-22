import { z } from "zod";

import {
  emailSchema,
  otpSchema,
  passwordSchema,
} from "./common.validator";

export const providerEmailChangeRequestSchema =
  z.object({
    body: z.object({
      email:
        emailSchema,
    }),
  });

export const providerEmailChangeVerifySchema =
  z.object({
    body: z.object({
      email:
        emailSchema,

      otp: otpSchema,
    }),
  });

export const providerPasswordChangeSchema =
  z.object({
    body: z.object({
      oldPassword:
        z.string().min(
          1,
          "Current password is required",
        ),

      newPassword:
        passwordSchema,
    }),
  });

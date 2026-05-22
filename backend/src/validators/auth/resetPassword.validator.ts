import { z } from "zod";

import {
  passwordSchema,
} from "../common.validator";

export const resetPasswordSchema =
  z.object({
    body: z.object({
      email: z
        .string()
        .email(
          "Valid email is required",
        ),

      token: z
        .string()
        .min(
          1,
          "Reset token is required",
        ),

      newPassword:
        passwordSchema,
    }),
  });

export type ResetPasswordDTO =
  z.infer<
    typeof resetPasswordSchema
  >["body"];
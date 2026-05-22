import { z } from "zod";

import {
  emailSchema,
} from "../common.validator";

export const forgotPasswordSchema =
  z.object({
    body: z.object({
      email:
        emailSchema,
    }),
  });

export type ForgotPasswordDTO =
  z.infer<
    typeof forgotPasswordSchema
  >["body"];
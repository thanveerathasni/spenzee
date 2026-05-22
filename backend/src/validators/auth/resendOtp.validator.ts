import { z } from "zod";

import {
  emailSchema,
} from "../common.validator";

export const resendOtpSchema =
  z.object({
    body: z.object({
      email:
        emailSchema,
    }),
  });

export type ResendOtpDTO =
  z.infer<
    typeof resendOtpSchema
  >["body"];
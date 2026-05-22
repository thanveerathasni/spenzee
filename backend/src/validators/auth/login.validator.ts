import { z } from "zod";

import {
  emailSchema,
  passwordSchema,
} from "../common.validator";

export const loginSchema =
  z.object({
    body: z.object({
      email: emailSchema,

      password:
        passwordSchema,
    }),
  });

export type LoginDTO =
  z.infer<
    typeof loginSchema
  >["body"];
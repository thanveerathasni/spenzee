import { z } from "zod";

import {
  emailSchema,
  passwordSchema,
} from "../common.validator";

export const signupSchema =
  z.object({
    body: z.object({
      email: emailSchema,

      password:
        passwordSchema,
    }),
  });

export type SignupDTO =
  z.infer<
    typeof signupSchema
  >["body"];
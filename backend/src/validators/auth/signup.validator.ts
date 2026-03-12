import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email").trim().toLowerCase(),

    password: z.string().min(8, "Password must be at least 8 characters").max(100),
  }),
});

export type SignupDTO = z.infer<typeof signupSchema>["body"];

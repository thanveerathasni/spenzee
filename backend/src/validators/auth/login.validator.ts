import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required")
  })
});

export type LoginDTO = z.infer<typeof loginSchema>["body"];

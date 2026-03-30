import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),

  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    })
    .optional(),
});
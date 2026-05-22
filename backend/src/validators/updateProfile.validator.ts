import { z } from "zod";

export const updateProfileSchema =
  z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

      phone: z
        .string()
        .trim()
        .min(7)
        .max(20)
        .optional(),

      gender: z
        .string()
        .trim()
        .optional(),

      occupation:
        z.string()
          .trim()
          .optional(),

      bio: z
        .string()
        .trim()
        .max(500)
        .optional(),
    }),
  });

export type UpdateProfileDTO =
  z.infer<
    typeof updateProfileSchema
  >["body"];
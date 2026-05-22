import { z } from "zod";
import { ADDRESS_TYPES } from "../models/Address.model";

const phoneSchema = z.string().min(7).max(20).trim();

export const addressBodySchema = z.object({
  fullName: z.string().min(2).max(120).trim(),
  phone: phoneSchema,
alternatePhone: z
  .string()
  .trim()
  .optional()
  .or(z.literal("")),
    houseName: z.string().min(1).max(160).trim(),
  street: z.string().min(1).max(180).trim(),
  city: z.string().min(1).max(120).trim(),
  district: z.string().min(1).max(120).trim(),
  state: z.string().min(1).max(120).trim(),
  country: z.string().min(1).max(120).trim().default("India"),
  postalCode: z.string().min(4).max(12).trim(),
landmark: z
  .string()
  .trim()
  .max(180)
  .optional()
  .or(z.literal("")),
    addressType: z.enum([
    ADDRESS_TYPES.HOME,
    ADDRESS_TYPES.WORK,
    ADDRESS_TYPES.OTHER,
  ]),
  isPrimary: z.boolean().optional(),
});

export const updateAddressBodySchema = addressBodySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one address field is required" },
);

export const addressSchema = z.object({ body: addressBodySchema });
export const updateAddressSchema = z.object({ body: updateAddressBodySchema });

export type AddressPayload = z.infer<typeof addressBodySchema>;
export type UpdateAddressPayload = z.infer<typeof updateAddressBodySchema>;

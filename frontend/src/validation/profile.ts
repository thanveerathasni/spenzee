import { z } from "zod";

/* ---------- PERSONAL INFO ---------- */
export const personalInfoSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email address")
     .optional(),

  phone: z
   .string()
   .regex(/^[0-9]{10}$/, "Phone must be 10 digits")


});

/* ---------- ADDRESS ---------- */
export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^[0-9]{7,15}$/, "Enter a valid phone number"),
alternatePhone: z
  .string()
  .trim()
  .optional()
  .or(z.literal("")),
    houseName: z.string().min(1, "House name is required"),
  street: z.string().min(3, "Street is too short"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z
    .string()
    .regex(/^[0-9A-Za-z -]{4,12}$/, "Postal code is invalid"),
  landmark: z.string().optional(),
  addressType: z.enum(["home", "work", "other"]),
  isPrimary: z.boolean(),
});

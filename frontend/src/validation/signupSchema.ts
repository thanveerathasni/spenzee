import { z } from "zod";

/* ---------- Helpers ---------- */
const cleanName = (v: string): string => v.trim().replace(/\s+/g, " ");
const cleanEmail = (v: string): string => v.trim().toLowerCase();

/* ---------- Strong password rule ---------- */
const strongPassword = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .regex(/[A-Z]/, "Add at least one CAPITAL letter")
  .regex(/[a-z]/, "Add at least one small letter")
  .regex(/[0-9]/, "Add at least one number")
  .regex(/[^A-Za-z0-9]/, "Add at least one special character")
  .refine(
    (p) => !/(password|1234|admin|qwerty|letmein)/i.test(p),
    { message: "Password is too common" }
  );

/* ---------- Main Schema ---------- */
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 letters")
      .refine(
        (v) => /^[A-Za-z]+( [A-Za-z]+)*$/.test(v),
        "Only letters, no extra spaces"
      )
      .transform(cleanName),

    email: z
      .string()
      .email("Invalid email format")
      .transform(cleanEmail),

    password: strongPassword,

    confirmPassword: z.string(),

    otp: z.string().optional(),
  })

  /* ----- Cross-field logic ----- */
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

  /* ----- Conditional OTP logic ----- */
  .refine(
    (d) => !d.otp || /^\d{6}$/.test(d.otp),
    { message: "OTP must be exactly 6 digits", path: ["otp"] }
  )

  /* ----- Anti-fake name logic ----- */
  .refine(
    (d) => !/(test|user|demo|abc)/i.test(d.name),
    { message: "Name looks fake", path: ["name"] }
  );

/* ---------- Type from Schema ---------- */
export type SignupFormData = z.infer<typeof signupSchema>;

import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name too short"),
  phone: z.string().min(10, "Invalid phone"),
});
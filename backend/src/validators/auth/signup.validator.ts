export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

import { z } from "zod";

export const emailSchema = z.string().email();

export type Email = z.infer<typeof emailSchema>;

export const validatedEmail = (email: Email): boolean =>
  emailSchema.safeParse(email).success;

export const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters"),
});

export type FormSchema = z.infer<typeof formSchema>;
export { zodResolver } from "@hookform/resolvers/zod";

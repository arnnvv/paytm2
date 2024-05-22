import { ZodObject, ZodOptional, ZodString, z } from "zod";

const signUpIn: ZodObject<{
  name: ZodOptional<ZodString>;
  email: ZodOptional<ZodString>;
  number: ZodString;
  password: ZodString;
}> = z.object({
  name: z.optional(z.string()),
  email: z.optional(z.string().email()),
  number: z.string().length(10),
  password: z.string().min(10),
});

export type SignUpIn = z.infer<typeof signUpIn>;

export const validate = (data: SignUpIn): boolean => {
  const result = signUpIn.safeParse(data);
  return result.success;
};

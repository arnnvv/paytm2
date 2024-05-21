import * as v from "valibot";

const signUpIn = v.object({
  name: v.optional(v.string()),
  email: v.optional(v.pipe(v.string(), v.email())),
  number: v.pipe(v.string(), v.length(10)),
  password: v.pipe(v.string(), v.minLength(10)),
});
export type SignUpIn = v.InferInput<typeof signUpIn>;

export const validate = (data: SignUpIn) => {
  const result = v.safeParse(signUpIn, data);
  return result.success;
};

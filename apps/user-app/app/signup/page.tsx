import { redirect } from "next/navigation";
import lucia, { validateRequest } from "../../lib/auth";
import Form, { ActionResult } from "../_components/form";
import Link from "next/link";
import { hash } from "@node-rs/argon2";
import { generateId } from "lucia";
import { Users, users } from "@repo/db/schema";
import { db } from "@repo/db/client";
import { validatedEmail } from "@repo/validate/client";
import { cookies } from "next/headers";

export default async (): Promise<JSX.Element> => {
  const { user } = await validateRequest();
  if (user) return redirect("/");
  return (
    <>
      <h1>Create an account</h1>
      <Form
        action={async (_: any, formData: FormData): Promise<ActionResult> => {
          "use server";
          const email = formData.get("email");
          if (typeof email !== "string") return { error: "Email is required" };
          if (!validatedEmail(email)) return { error: "Invalid email" };
          const password = formData.get("password");
          if (
            typeof password !== "string" ||
            password.length < 8 ||
            password.length > 64
          )
            return { error: "Invalid password" };
          const hashedPassword = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
          });
          const id = generateId(10);
          try {
            const existingUser = (await db.query.users.findFirst({
              where: (users, { eq }) => eq(users.email, email),
            })) as Users | undefined;
            if (existingUser) return { error: "User already exists" };
            await db.insert(users).values({
              id,
              password: hashedPassword,
              email,
            });
            const session = await lucia.createSession(id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(
              sessionCookie.name,
              sessionCookie.value,
              sessionCookie.attributes,
            );
          } catch {
            throw new Error("Unexpected error");
          }
          return redirect("/");
        }}
      >
        <label htmlFor="email">Email</label>
        <input name="email" id="email" placeholder="lauda@lasan.com" />
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="**********"
        />
        <br />
        <button>Continue</button>
      </Form>
      <Link href="/login">Sign in</Link>
    </>
  );
};

import { redirect } from "next/navigation";
import lucia, { validateRequest } from "../../lib/auth";
import Form, { ActionResult } from "../_components/form";
import Link from "next/link";
import { validatedEmail } from "@repo/validate/client";
import { db } from "@repo/db/client";
import { Users } from "@repo/db/schema";
import { cookies } from "next/headers";
import { LegacyScrypt } from "lucia";

export default async (): Promise<JSX.Element> => {
  const { user } = await validateRequest();
  if (user) return redirect("/");
  return (
    <>
      <h1>Sign In</h1>
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
          try {
            const existingUser = (await db.query.users.findFirst({
              where: (users, { eq }) => eq(users.email, email),
            })) as Users | undefined;
            if (!existingUser) return { error: "User not found" };
            const validPassword = await new LegacyScrypt().verify(
              existingUser.password,
              password,
            );
            if (!validPassword) return { error: "Incorrect Password" };
            const session = await lucia.createSession(existingUser.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(
              sessionCookie.name,
              sessionCookie.value,
              sessionCookie.attributes,
            );
          } catch {
            throw new Error("Something went wrong");
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
          placeholder="********"
        />
        <br />
        <button>Continue</button>
      </Form>
      <Link href="/signup">Create an account</Link>
    </>
  );
};

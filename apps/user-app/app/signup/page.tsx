import { redirect } from "next/navigation";
import lucia, { validateRequest } from "../../lib/auth";
import { generateId, LegacyScrypt } from "lucia";
import { Users, users } from "@repo/db/schema";
import { db } from "@repo/db/client";
import { validatedEmail } from "@repo/validate/client";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@repo/ui/components/ui/card";
import FormComponent, { ActionResult } from "../_components/FormComponent";

export default async (): Promise<JSX.Element> => {
  const { user } = await validateRequest();
  if (user) return redirect("/");

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormComponent
            action={async (
              _: any,
              formData: FormData,
            ): Promise<ActionResult> => {
              "use server";
              const email = formData.get("email");
              if (typeof email !== "string")
                return { error: "Email is required" };
              if (!validatedEmail(email)) return { error: "Invalid email" };
              const password = formData.get("password");
              if (
                typeof password !== "string" ||
                password.length < 8 ||
                password.length > 64
              )
                return { error: "Invalid password" };
              const id = generateId(10);
              try {
                const hashedPassword = await new LegacyScrypt().hash(password);
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  placeholder="email@example.com"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="********"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
          </FormComponent>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Already have an account? Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

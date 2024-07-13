import lucia, { validateRequest } from "../lib/auth";
import { redirect } from "next/navigation";
import Form, { ActionResult } from "./_components/form";
import { cookies } from "next/headers";
import { Button } from "@repo/ui/components/ui/button";

export default async (): Promise<JSX.Element> => {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <>
      <h1>Hi, {user.email}!</h1>
      <p>Your user ID is {user.id}.</p>
      <Form
        action={async (): Promise<ActionResult> => {
          "use server";
          const { session } = await validateRequest();
          if (!session) return { error: "not logged in" };

          await lucia.invalidateSession(session.id);
          const sessionCookie = lucia.createBlankSessionCookie();
          cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
          );
          return redirect("/login");
        }}
      >
        <Button>Sign out</Button>
      </Form>
    </>
  );
};

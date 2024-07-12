import lucia, { validateRequest } from "../lib/auth";
import { redirect } from "next/navigation";
import { ActionResult, Form } from "./_components/form";
import { cookies } from "next/headers";

export default async function Home(): Promise<JSX.Element> {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <>
      <h1>Hi, {user.name}!</h1>
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
        <button>Sign out</button>
      </Form>
    </>
  );
}

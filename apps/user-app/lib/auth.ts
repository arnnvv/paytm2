import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@repo/db/client";
import { sessions, users, type Users as DbUser } from "@repo/db/schema";
import { Lucia, Session, TimeSpan, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes: {
    number: string | null;
    name: string | null;
    email: string;
    password: string;
  }) => {
    return {
      name: attributes.name,
    };
  },
  sessionExpiresIn: new TimeSpan(30, "d"),
});

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { session: null; user: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId)
      return {
        session: null,
        user: null,
      };
    const validSession = await lucia.validateSession(sessionId);
    try {
      if (validSession.session && validSession.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(
          validSession.session.id,
        );
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!validSession.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch (e) {
      throw new Error("Failed to validate session");
    }
    return validSession;
  },
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DbUser, "id">;
  }
}

export default lucia;

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@repo/db/client";
import { Lucia } from "lucia";

//const adapter = new DrizzlePostgreSQLAdapter(db);

/*const lucia = new Lucia(adapter {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export default lucia;*/

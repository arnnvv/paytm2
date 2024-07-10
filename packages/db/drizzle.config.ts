import { type Config } from "drizzle-kit";

export const getDB = (): string => {
  const db: string | undefined = process.env.DATABASE_URL;
  if (!db || db.length === 0) throw new Error("DATABASE_URL is not set");
  return db;
};

export default {
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getDB(),
  },
  tablesFilter: ["paytm_"],
  out: "./drizzle",
} satisfies Config;

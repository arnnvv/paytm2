import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import { getDB } from "./drizzle.config";
export { eq } from "drizzle-orm";

export const pool = new Pool({ connectionString: getDB() });
export const db = drizzle(pool, { schema });

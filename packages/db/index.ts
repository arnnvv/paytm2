import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { getDB } from "./drizzle.config";

export const db = drizzle(neon(getDB()), { schema });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing");

// HTTP transport: suitable for short, serverless Next.js requests.
const sqlClient = neon(connectionString);
export const db = drizzle({ client: sqlClient, schema });

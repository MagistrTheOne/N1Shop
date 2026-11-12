import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing in .env");
const parsedUrl = new URL(url);
if (parsedUrl.protocol !== "postgres:" && parsedUrl.protocol !== "postgresql:") {
  throw new Error("DATABASE_URL must use the PostgreSQL protocol");
}

export default defineConfig({
  schema: "./src/lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});

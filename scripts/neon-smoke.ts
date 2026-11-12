import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../src/lib/db/core";

async function main() {
  await db.execute(sql`SELECT 1`);
  console.log("POSTGRES_READ_OK");
}

main().catch((error: unknown) => {
  const kind = error instanceof Error ? error.name : "Error";
  console.error(`DATABASE_SMOKE_FAILED: ${kind}`);
  process.exitCode = 1;
});

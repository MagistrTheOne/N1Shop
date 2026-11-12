import { Pool } from "pg";

// Neon Functions run next to Postgres. For long-lived Node functions use pg Pool.
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
    try {
      await pool.query("SELECT 1");
      return Response.json({ status: "ok" });
    } catch {
      return Response.json({ status: "unavailable" }, { status: 503 });
    }
  },
};

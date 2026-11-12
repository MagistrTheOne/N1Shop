import "server-only";
import { createNeonAuth } from "@neon/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

if (!baseUrl) throw new Error("NEON_AUTH_BASE_URL is missing");
if (new URL(baseUrl).protocol !== "https:") throw new Error("NEON_AUTH_BASE_URL must use HTTPS");
if (!cookieSecret || cookieSecret.length < 32) {
  throw new Error("NEON_AUTH_COOKIE_SECRET must contain at least 32 characters");
}

export const auth = createNeonAuth({ baseUrl, cookies: { secret: cookieSecret } });

import "server-only";
import { createNeonAuth } from "@neon/auth/next/server";

let authInstance: ReturnType<typeof createNeonAuth> | undefined;

export function hasNeonAuthConfig() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !cookieSecret || cookieSecret.length < 32) return false;
  try { return new URL(baseUrl).protocol === "https:"; }
  catch { return false; }
}

export function getAuth() {
  if (authInstance) return authInstance;
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !cookieSecret || cookieSecret.length < 32 || !hasNeonAuthConfig()) {
    throw new Error("Neon Auth environment is not configured");
  }
  authInstance = createNeonAuth({ baseUrl, cookies: { secret: cookieSecret } });
  return authInstance;
}

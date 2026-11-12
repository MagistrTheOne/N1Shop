import "server-only";
import { auth } from "./server";

export async function getCurrentUser() {
  const { data, error } = await auth.getSession();
  if (error) return null;
  return data?.user ?? null;
}

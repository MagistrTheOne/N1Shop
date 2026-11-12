import "server-only";
import { getAuth } from "./server";

export async function getCurrentUser() {
  try {
    const { data, error } = await getAuth().getSession();
    if (error) return null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}

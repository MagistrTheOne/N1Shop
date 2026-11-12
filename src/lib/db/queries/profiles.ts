import "server-only";
import { eq } from "drizzle-orm";
import { db } from "../client";
import { profiles, type Profile } from "../schema";
import { getCurrentUser } from "@/lib/auth/session";

export async function upsertProfile(input: { authUserId: string; displayName: string; email: string }): Promise<Profile> {
  const existing = await getProfileByAuthUserId(input.authUserId);
  if (existing && existing.displayName === input.displayName && existing.email === input.email) return existing;
  const [profile] = await db.insert(profiles).values(input)
    .onConflictDoUpdate({
      target: profiles.authUserId,
      set: { displayName: input.displayName, email: input.email, updatedAt: new Date() },
    })
    .returning();
  return profile;
}

export async function getProfileByAuthUserId(authUserId: string): Promise<Profile | undefined> {
  const [profile] = await db.select().from(profiles).where(eq(profiles.authUserId, authUserId)).limit(1);
  return profile;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return (await getProfileByAuthUserId(user.id)) ?? null;
}

export async function ensureProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return upsertProfile({
    authUserId: user.id,
    displayName: user.name?.trim() || user.email,
    email: user.email,
  });
}

export async function updateCurrentProfile(displayName: string): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return upsertProfile({
    authUserId: user.id,
    displayName,
    email: user.email,
  });
}

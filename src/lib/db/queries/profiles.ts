import "server-only";
import { eq } from "drizzle-orm";
import { db } from "../client";
import { profiles, type Profile } from "../schema";

export async function upsertProfile(input: { authUserId: string; displayName: string; email: string }): Promise<Profile> {
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

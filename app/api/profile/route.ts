import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getProfileByAuthUserId, upsertProfile } from "@/lib/db/queries/profiles";

export const runtime = "nodejs";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });

  try {
    const profile = await upsertProfile({
      authUserId: user.id,
      displayName: user.name?.trim() || user.email,
      email: user.email,
    });
    return NextResponse.json({ profile: { id: profile.id, displayName: profile.displayName, email: profile.email } }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Profile could not be saved" }, { status: 503 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });

  try {
    const profile = await getProfileByAuthUserId(user.id);
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json({ profile: { id: profile.id, displayName: profile.displayName, email: profile.email } }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Profile could not be loaded" }, { status: 503 });
  }
}

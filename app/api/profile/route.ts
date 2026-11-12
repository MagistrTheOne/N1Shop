import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getAuth } from "@/lib/auth/server";
import { ensureProfile, getCurrentProfile, updateCurrentProfile } from "@/lib/db/queries/profiles";
import { isSameOriginRequest } from "@/lib/auth/request-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: { "Cache-Control": "private, no-store" } });

  try {
    const profile = await ensureProfile();
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
    return NextResponse.json({ profile: { displayName: profile.displayName, email: profile.email } }, {
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
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json({ profile: { displayName: profile.displayName, email: profile.email } }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Profile could not be loaded" }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: { "Cache-Control": "private, no-store" } });
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const displayName = payload && typeof payload === "object" ? (payload as Record<string, unknown>).displayName : null;
  if (typeof displayName !== "string" || displayName.trim().length < 2 || displayName.trim().length > 80 || /[\u0000-\u001f\u007f]/.test(displayName)) {
    return NextResponse.json({ error: "Имя должно содержать от 2 до 80 символов." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
  try {
    const authResult = await getAuth().updateUser({ name: displayName.trim() });
    if (authResult.error) return NextResponse.json({ error: "Не удалось обновить профиль." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
    const profile = await updateCurrentProfile(displayName.trim());
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
    return NextResponse.json({ profile: { displayName: profile.displayName, email: profile.email } }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Не удалось обновить профиль." }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}

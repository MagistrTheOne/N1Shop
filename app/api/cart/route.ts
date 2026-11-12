import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { addCartItem, getUserCart, removeCartItem } from "@/lib/db/queries/carts";

export const runtime = "nodejs";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const privateHeaders = { "Cache-Control": "private, no-store" };

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  try {
    const cart = await getUserCart(user.id);
    return NextResponse.json({ items: cart.items }, { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Cart unavailable" }, { status: 503, headers: privateHeaders });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { productVariantId, quantity } = body as Record<string, unknown>;
  if (typeof productVariantId !== "string" || !UUID.test(productVariantId) || typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
    return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
  }
  try {
    const item = await addCartItem(user.id, user.email, user.name || "", productVariantId, quantity);
    return NextResponse.json({ item }, { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Cart unavailable" }, { status: 503, headers: privateHeaders });
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  const variantId = new URL(request.url).searchParams.get("productVariantId");
  if (!variantId || !UUID.test(variantId)) return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
  try {
    await removeCartItem(user.id, variantId);
    return NextResponse.json({ ok: true }, { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Cart unavailable" }, { status: 503, headers: privateHeaders });
  }
}

import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../client";
import { cartItems, carts, profiles } from "../schema";
import { upsertProfile } from "./profiles";

async function activeCartForUser(authUserId: string, email: string, name: string) {
  let [profile] = await db.select().from(profiles).where(eq(profiles.authUserId, authUserId)).limit(1);
  if (!profile) profile = await upsertProfile({ authUserId, email, displayName: name || email });

  let [cart] = await db.select().from(carts).where(and(eq(carts.profileId, profile.id), eq(carts.status, "active"))).limit(1);
  if (!cart) {
    await db.insert(carts).values({ profileId: profile.id }).onConflictDoNothing();
    [cart] = await db.select().from(carts).where(and(eq(carts.profileId, profile.id), eq(carts.status, "active"))).limit(1);
  }
  if (!cart) throw new Error("Active cart unavailable");
  return cart;
}

export async function getUserCart(authUserId: string) {
  const [profile] = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.authUserId, authUserId)).limit(1);
  if (!profile) return { cart: null, items: [] };
  const [cart] = await db.select().from(carts).where(and(eq(carts.profileId, profile.id), eq(carts.status, "active"))).limit(1);
  if (!cart) return { cart: null, items: [] };
  const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cart.id));
  return { cart, items };
}

export async function addCartItem(authUserId: string, email: string, name: string, variantId: string, quantity: number) {
  const cart = await activeCartForUser(authUserId, email, name);
  await db.insert(cartItems).values({ cartId: cart.id, productVariantId: variantId, quantity })
    .onConflictDoUpdate({
      target: [cartItems.cartId, cartItems.productVariantId],
      set: { quantity: sql`least(${cartItems.quantity} + ${quantity}, 99)`, updatedAt: new Date() },
    });
  const [item] = await db.select().from(cartItems).where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productVariantId, variantId))).limit(1);
  return item;
}

export async function removeCartItem(authUserId: string, variantId: string) {
  const [profile] = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.authUserId, authUserId)).limit(1);
  if (!profile) return;
  const [cart] = await db.select({ id: carts.id }).from(carts).where(and(eq(carts.profileId, profile.id), eq(carts.status, "active"))).limit(1);
  if (!cart) return;
  await db.delete(cartItems).where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productVariantId, variantId)));
}

import { sql } from "drizzle-orm";
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  status: text("status").$type<"active" | "converted" | "abandoned">().default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("carts_profile_id_idx").on(table.profileId),
  check("carts_status_check", sql`${table.status} in ('active', 'converted', 'abandoned')`),
  uniqueIndex("carts_one_active_per_profile_uidx").on(table.profileId).where(sql`${table.status} = 'active'`),
]);

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;

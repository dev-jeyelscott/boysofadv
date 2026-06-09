import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const partnerStatusEnum = pgEnum("partner_status", [
  "draft",
  "active",
  "inactive",
]);

export const partners = pgTable("partners", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),

  logoUrl: text("logo_url"),
  logoKey: text("logo_key"),

  websiteUrl: text("website_url"),
  facebookUrl: text("facebook_url"),

  description: text("description"),
  category: text("category"),
  status: partnerStatusEnum("status").notNull().default("draft"),

  isOfficial: boolean("is_official").notNull().default(true),
  displayOrder: text("display_order"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

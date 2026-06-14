import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const buildStatusEnum = pgEnum("build_status", [
  "draft",
  "for_review",
  "published",
  "unpublished",
  "rejected",
  "archived",
]);

export const builds = pgTable("builds", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),

  motorcycleModel: text("motorcycle_model").notNull(), // ADV 150 / ADV 160
  yearModel: text("year_model"),

  description: text("description"),
  concept: text("concept"),
  engineSetup: text("engine_setup"),
  cvtSetup: text("cvt_setup"),
  suspensionSetup: text("suspension_setup"),
  brakingSetup: text("braking_setup"),
  wheelSetup: text("wheel_setup"),
  accessories: text("accessories"),

  coverImageUrl: text("cover_image_url"),
  coverImageKey: text("cover_image_key"),

  popularityScore: integer("popularity_score").notNull().default(0),
  popularityCalculatedAt: timestamp("popularity_calculated_at"),

  status: buildStatusEnum("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),

  publishedAt: timestamp("published_at"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

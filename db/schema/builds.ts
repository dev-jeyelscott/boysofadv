import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const buildStatusEnum = pgEnum("build_status", [
  "draft",
  "for_review",
  "published",
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
  engineSetup: text("engine_setup"),
  cvtSetup: text("cvt_setup"),
  suspensionSetup: text("suspension_setup"),
  brakingSetup: text("braking_setup"),
  wheelSetup: text("wheel_setup"),
  accessories: text("accessories"),

  coverImageUrl: text("cover_image_url"),

  status: buildStatusEnum("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),

  publishedAt: timestamp("published_at"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
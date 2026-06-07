import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

import { builds } from "./builds";
import { users } from "./users";

export const galleryImageTypeEnum = pgEnum("gallery_image_type", [
  "build",
  "event",
  "general",
]);

export const galleryImages = pgTable("gallery_images", {
  id: text("id").primaryKey(),

  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),

  buildId: text("build_id").references(() => builds.id, {
    onDelete: "cascade",
  }),

  type: galleryImageTypeEnum("type").notNull().default("general"),

  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  caption: text("caption"),

  displayOrder: integer("display_order").notNull().default(0),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
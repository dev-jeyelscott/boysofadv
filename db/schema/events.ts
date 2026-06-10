import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "completed",
  "cancelled",
]);

export const events = pgTable("events", {
  id: text("id").primaryKey(),

  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),

  description: text("description"),
  location: text("location"),

  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),

  posterImageUrl: text("poster_image_url"),
  posterImageKey: text("poster_image_key"),

  status: eventStatusEnum("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

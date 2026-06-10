import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

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

  latitude: numeric("latitude", {
    precision: 10,
    scale: 7,
  }),

  longitude: numeric("longitude", {
    precision: 10,
    scale: 7,
  }),

  geoRadiusMeters: integer("geo_radius_meters").notNull().default(80),

  posterImageUrl: text("poster_image_url"),
  posterImageKey: text("poster_image_key"),

  status: eventStatusEnum("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

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

  startsAt: timestamp("start_date").notNull(),
  endsAt: timestamp("end_date"),

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
  statusUpdatedBy: text("statusUpdatedBy"),
  isFeatured: boolean("is_featured").notNull().default(false),

  completedAt: timestamp("completedAt"),
  attendanceSummarySentAt: timestamp("attendance_summary_sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  numeric,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { tsvector } from "./search-vector";
import { users } from "./users";

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "completed",
  "cancelled",
]);

export const events = pgTable(
  "events",
  {
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

    publishedAt: timestamp("published_at"),
    cancelledAt: timestamp("cancelled_at"),
    cancelledBy: text("cancelled_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    cancellationReason: text("cancellation_reason"),
    completedAt: timestamp("completedAt"),
    attendanceSummarySentAt: timestamp("attendance_summary_sent_at"),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`
        setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("description", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("location", '')), 'C')
      `,
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("events_status_idx").on(table.status),
    index("events_start_date_idx").on(table.startsAt),
    index("events_end_date_idx").on(table.endsAt),
    index("events_created_at_idx").on(table.createdAt),
    index("events_status_start_date_idx").on(table.status, table.startsAt),
    index("events_status_end_date_idx").on(table.status, table.endsAt),
    index("events_cancelled_by_idx").on(table.cancelledBy),
    index("events_search_vector_idx").using("gin", table.searchVector),
  ],
);

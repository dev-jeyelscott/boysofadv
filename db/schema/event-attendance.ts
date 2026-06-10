import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { events } from "./events";
import { users } from "./users";
import { nanoid } from "nanoid";

export const eventAttendance = pgTable("event_attendance", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),

  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  status: text("status").notNull().default("checked_in"),

  checkInLatitude: numeric("check_in_latitude", {
    precision: 10,
    scale: 7,
  }).notNull(),

  checkInLongitude: numeric("check_in_longitude", {
    precision: 10,
    scale: 7,
  }).notNull(),

  gpsAccuracyMeters: numeric("gps_accuracy_meters", {
    precision: 10,
    scale: 2,
  }),

  distanceMeters: numeric("distance_meters", {
    precision: 10,
    scale: 2,
  }).notNull(),

  checkedInAt: timestamp("checked_in_at").defaultNow().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
